# src/stock_databook.py

from dataclasses import dataclass
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import yfinance as yf


@dataclass
class Level1Technical:
    """テクニカル指標レベル1の結果をまとめるクラス"""
    price_df: pd.DataFrame          # OHLCV + return など
    ma_5: pd.Series                 # 5日移動平均
    ma_25: pd.Series                # 25日移動平均
    ma_75: pd.Series                # 75日移動平均
    vol_20: float                   # 過去20営業日のボラティリティ
    last_price: float               # 最新終値
    last_date: datetime             # 最新の日付
    trend_comment: str              # トレンドの日本語コメント


def fetch_price_data(symbol: str, lookback_days: int = 365) -> pd.DataFrame:
    """yfinance で過去株価データ（日足）を取得して整形する"""
    end = datetime.today()
    start = end - timedelta(days=lookback_days)

    df = yf.download(symbol, start=start, end=end)
    if df.empty:
        return df

    # 列名を小文字に揃えておく
    df = df.rename(columns=str.lower)

    # 調整後終値がなければ close を使う
    if "adj close" in df.columns:
        df["price"] = df["adj close"]
    else:
        df["price"] = df["close"]

    # 日次リターン
    df["return"] = df["price"].pct_change()

    return df


def calc_level1_technical(df: pd.DataFrame) -> Level1Technical | None:
    """テクニカル指標レベル1を計算する"""
    if df.empty or len(df) < 30:
        return None

    price = df["price"]

    ma_5 = price.rolling(window=5).mean()
    ma_25 = price.rolling(window=25).mean()
    ma_75 = price.rolling(window=75).mean()

    # 20日ボラティリティ（％表記にしやすいようにそのまま返す）
    recent_returns = df["return"].dropna().tail(20)
    if len(recent_returns) == 0:
        vol_20 = float("nan")
    else:
        vol_20 = float(recent_returns.std())

    last_date = df.index.max()
    last_price = float(price.loc[last_date])

    trend_comment = describe_trend(price, ma_5, ma_25, ma_75)

    return Level1Technical(
        price_df=df,
        ma_5=ma_5,
        ma_25=ma_25,
        ma_75=ma_75,
        vol_20=vol_20,
        last_price=last_price,
        last_date=last_date,
        trend_comment=trend_comment,
    )


def describe_trend(
    price: pd.Series,
    ma_5: pd.Series,
    ma_25: pd.Series,
    ma_75: pd.Series,
) -> str:
    """移動平均線と価格から、ざっくりトレンドをコメントにする"""
    # 最新値を取得
    last_idx = price.index.max()
    p = float(price.loc[last_idx])
    m5 = float(ma_5.loc[last_idx])
    m25_val = ma_25.loc[last_idx]
    m75_val = ma_75.loc[last_idx]
    m25 = float(m25_val) if not np.isnan(m25_val) else None
    m75 = float(m75_val) if not np.isnan(m75_val) else None

    # データが少なすぎる場合
    if m25 is None or m75 is None:
        return "データがまだ少ないため、トレンド判定は参考程度です。"

    # シンプルな判定ロジック
    if p > m5 > m25 > m75:
        return "短期・中期・長期の順に上向きで、上昇トレンドが続いている可能性があります。"
    elif p < m5 < m25 < m75:
        return "短期・中期・長期の順に下向きで、下降トレンドが続いている可能性があります。"
    elif p > m25 and m25 > m75:
        return "中長期では上昇傾向ですが、短期的には方向感がはっきりしない状態です。"
    elif p < m25 and m25 < m75:
        return "中長期では下降傾向ですが、短期的には一時的な反発が入っているかもしれません。"
    else:
        return "移動平均線が絡み合っており、もみ合いやトレンド転換の過渡期にあるかもしれません。"


def summarize_volatility(vol_20: float) -> str:
    """20日ボラティリティから、ざっくり"揺れやすさ"をコメントにする"""
    if np.isnan(vol_20):
        return "ボラティリティを計算できませんでした。"

    vol_pct = vol_20 * 100

    if vol_pct < 1.0:
        return f"直近20営業日の日次ボラティリティは約 {vol_pct:.1f}% で、比較的値動きはおとなしい部類です。"
    elif vol_pct < 2.5:
        return f"直近20営業日の日次ボラティリティは約 {vol_pct:.1f}% で、ほどほどの値動きです。"
    elif vol_pct < 5.0:
        return f"直近20営業日の日次ボラティリティは約 {vol_pct:.1f}% で、やや値動きの大きい銘柄です。"
    else:
        return f"直近20営業日の日次ボラティリティは約 {vol_pct:.1f}% で、かなり値動きが激しい銘柄です。"

