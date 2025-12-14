# src/app.py

import streamlit as st

from stock_databook import (
    fetch_price_data,
    calc_level1_technical,
    summarize_volatility,
)


st.set_page_config(
    page_title="Stock Data Book",
    layout="wide",
)


def main():
    st.title("📚 株データブック（テクニカル付き v1）")

    # --- サイドバー（設定） ---
    st.sidebar.header("⚙️ 設定")

    symbol = st.sidebar.text_input(
        "銘柄コード（例: 日本株 7203.T / 米株 AAPL）",
        value="7203.T",
    )

    lookback_days = st.sidebar.slider(
        "何日分さかのぼって表示するか",
        min_value=60,
        max_value=730,
        value=365,
        step=30,
    )

    st.sidebar.markdown("---")
    st.sidebar.markdown(
        "このアプリは **中期〜長期投資の勉強のために、1銘柄のテクニカル情報を整理して見やすくまとめるデータブック**です。"
    )
    st.sidebar.markdown(
        "売買シグナルを出すためのツールではなく、「この銘柄の値動きの特徴を理解するための参考資料」という位置づけです。"
    )

    # --- メインコンテンツ ---
    if not symbol:
        st.info("左のサイドバーから銘柄コードを入力してください。")
        return

    st.subheader(f"📄 {symbol} のデータブック（過去 {lookback_days} 日）")

    # 株価データ取得
    with st.spinner("株価データを取得中..."):
        df = fetch_price_data(symbol, lookback_days=lookback_days)

    if df.empty:
        st.error("株価データを取得できませんでした。銘柄コードが正しいか確認してください。")
        return

    level1 = calc_level1_technical(df)
    if level1 is None:
        st.error("データが少なすぎて、テクニカル指標を計算できませんでした。期間を長めに設定してみてください。")
        return

    # --- 概要セクション ---
    with st.expander("🧾 概要（Overview）", expanded=True):
        col1, col2 = st.columns(2)

        with col1:
            st.markdown(f"- **銘柄コード:** `{symbol}`")
            st.markdown(f"- **表示期間:** 過去 {lookback_days} 日")
            st.markdown(f"- **最新日:** {level1.last_date.date()}")
            st.markdown(f"- **最新終値:** {level1.last_price:.2f}")

        with col2:
            st.markdown("**ここで見るポイント**")
            st.markdown(
                "- まずは「どの銘柄を」「どれくらいの期間」で見ているかを確認します。\n"
                "- このあと出てくるテクニカル指標は、すべてこの期間のデータに基づいて計算されています。"
            )

    # --- テクニカル レベル1 ---
    with st.expander("📈 テクニカル レベル1（基礎）", expanded=True):
        st.markdown(
            "短期・中期・長期の移動平均線と、直近のボラティリティから、トレンドと"揺れやすさ"をざっくり確認します。"
        )

        # チャート用のデータフレーム
        chart_df = level1.price_df[["price"]].copy()
        chart_df["MA_5"] = level1.ma_5
        chart_df["MA_25"] = level1.ma_25
        chart_df["MA_75"] = level1.ma_75

        st.line_chart(chart_df)

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**現在値と移動平均線**")

            last_idx = level1.price_df.index.max()

            table_df = (
                chart_df.tail(1)
                .rename(index={last_idx: str(last_idx.date())})
                .round(2)
            )
            st.table(table_df)

            st.markdown(
                "- `price`: 調整後終値（または終値）\n"
                "- `MA_5 / 25 / 75`: それぞれ5日・25日・75日の移動平均線です。"
            )

        with col2:
            st.markdown("**トレンド & ボラティリティコメント**")
            st.markdown(f"- トレンド解説：{level1.trend_comment}")
            vol_comment = summarize_volatility(level1.vol_20)
            st.markdown(f"- ボラティリティ：{vol_comment}")

            st.markdown("**ここで見るポイント**")
            st.markdown(
                "- 価格が移動平均線より上にあるか下にあるかで、上昇寄りか下降寄りかをざっくり確認します。\n"
                "- 短期・中期・長期の移動平均線がきれいに並んでいるときは、トレンドが続きやすいと考える人もいます。\n"
                "- ボラティリティが高いほど、1日ごとの値動きが大きくなりがちです。"
            )

    # --- テクニカル レベル2（枠だけ / 今後拡張） ---
    with st.expander("⚙️ テクニカル レベル2（標準指標・RSI/MACDなど）", expanded=False):
        st.markdown(
            "ここには今後、RSI・MACD・ボリンジャーバンドなど、教科書に載っている代表的なテクニカル指標を追加していけます。"
        )
        st.markdown(
            "- 例: RSI（買われすぎ/売られすぎ）、MACD（トレンド転換のヒント）、ボリンジャーバンド（価格のバンド）など。"
        )
        st.info("まだ実装していないため、現時点では説明のみです。今後ステップアップ的に追加していく想定です。")

    # --- テクニカル レベル3（上級指標・枠だけ） ---
    with st.expander("🧠 テクニカル レベル3（上級・一目均衡表など）", expanded=False):
        st.markdown(
            "ここには今後、一目均衡表・ADX・出来高系オシレーターなど、より高度なテクニカル指標を追加できます。"
        )
        st.info(
            "上級指標は、まずレベル1とレベル2に慣れてから触るのがおすすめです。現時点では枠だけ用意しています。"
        )

    st.markdown("---")
    st.markdown(
        "このデータブックは「売買シグナル」を出すものではなく、**中期〜長期でその銘柄の値動きの特徴を理解するための参考資料**という位置づけです。"
    )


if __name__ == "__main__":
    main()

