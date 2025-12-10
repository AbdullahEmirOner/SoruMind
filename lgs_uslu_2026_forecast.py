import pandas as pd
import numpy as np
from pathlib import Path

# ============================================================
# 0. AYARLAR
# ============================================================

BASE_DIR = Path(".")
INPUT_FILE = BASE_DIR / "uslusayilar_synthetic_1000_no_year.xlsx"
OUTPUT_FILE = BASE_DIR / "uslusayilar_2026_tahmini_1000.xlsx"

TARGET_YEAR = 2026
N_2026 = 1000  # 2026 için kaç soru üretmek istiyorsun

# Alt konu sayısı aralığı (her soruda kaç etiket olsun)
ALT_KONU_MIN = 2
ALT_KONU_MAX = 4

# ============================================================
# 1. VERİYİ YÜKLE
# ============================================================

df = pd.read_excel(INPUT_FILE)
print("Girdi veri boyutu:", df.shape)
print("Sütunlar:", df.columns.tolist())

# Beklediğimiz sütunlar:
# ['Yıl' (boş olabilir), 'Soru No', 'Konu', 'Alt Konu', 'Zorluk', 'Tür', 'Çözüm Yöntemi', 'Cevap']

# Eğer bazı sütunlar yoksa hata verelim (özellikle Alt Konu, Zorluk, Tür, Çözüm Yöntemi, Cevap önemli)
required_cols = ["Alt Konu", "Zorluk", "Tür", "Çözüm Yöntemi", "Cevap"]
for col in required_cols:
    if col not in df.columns:
        raise ValueError(f"Girdi dosyasında '{col}' sütunu bulunamadı. Excel'i kontrol et.")

# ============================================================
# 2. DAĞILIMLARI ÇIKART (TÜRLERİ VE ETİKETLERİ)
# ============================================================

# Zorluk dağılımı
zorluk_counts = df["Zorluk"].value_counts(dropna=True)
zorluk_values = zorluk_counts.index.to_list()
zorluk_probs = (zorluk_counts / zorluk_counts.sum()).to_list()

# Tür dağılımı
tur_counts = df["Tür"].value_counts(dropna=True)
tur_values = tur_counts.index.to_list()
tur_probs = (tur_counts / tur_counts.sum()).to_list()

# Çözüm Yöntemi dağılımı
cozum_counts = df["Çözüm Yöntemi"].value_counts(dropna=True)
cozum_values = cozum_counts.index.to_list()
cozum_probs = (cozum_counts / cozum_counts.sum()).to_list()

# Cevap dağılımı
cevap_counts = df["Cevap"].value_counts(dropna=True)
cevap_values = cevap_counts.index.to_list()
cevap_probs = (cevap_counts / cevap_counts.sum()).to_list()

# Soru No için istersen aralık bulalım (ama 1'den N_2026'ya kadar da gidebiliriz)
if "Soru No" in df.columns:
    soru_min = int(df["Soru No"].min())
    soru_max = int(df["Soru No"].max())
else:
    soru_min, soru_max = 1, N_2026

print("\nDağılımlar:")
print("Zorluk:", zorluk_counts.to_dict())
print("Tür:", tur_counts.to_dict())
print("Çözüm Yöntemi:", cozum_counts.to_dict())
print("Cevap:", cevap_counts.to_dict())
print(f"Soru No aralığı (orijinal): {soru_min} - {soru_max}")

# ============================================================
# 3. ALT KONU ETİKETLERİNİ ÇIKART (TAG FREKANSI)
# ============================================================

# 'Alt Konu' -> virgülle ayrılmış etiketler
all_tags = []
for val in df["Alt Konu"].astype(str):
    parts = [p.strip() for p in val.split(",") if p.strip() != ""]
    all_tags.extend(parts)

tag_counts = pd.Series(all_tags).value_counts()
tag_values = tag_counts.index.to_list()
tag_probs = (tag_counts / tag_counts.sum()).to_list()

print("\nAlt Konu etiketleri ve sayıları (ilk 10):")
print(tag_counts.head(10))

def sample_alt_konu(min_k=2, max_k=4):
    """
    Alt Konu etiketlerini, orijinal tag frekanslarına göre
    2-4 adet (veya parametreye göre) rastgele seç.
    """
    k = np.random.randint(min_k, max_k + 1)
    # replace=False ile aynı tag tekrar gelmesin
    idx = np.random.choice(len(tag_values), size=min(k, len(tag_values)), replace=False, p=tag_probs)
    tags = [tag_values[i] for i in idx]
    return ", ".join(tags)

# ============================================================
# 4. 2026 İÇİN YENİ 1000 SATIR ÜRET
# ============================================================

rows_2026 = []

for i in range(N_2026):
    yil = TARGET_YEAR
    # Soru No istersen 1..N_2026 olsun, istersen orijinal aralıktan random seç:
    soru_no = i + 1   # veya: np.random.randint(soru_min, soru_max + 1)

    konu = "Üslü İfadeler"  # veri zaten bu konu için, sabit tutuyoruz
    alt_konu = sample_alt_konu(ALT_KONU_MIN, ALT_KONU_MAX)

    zorluk = np.random.choice(zorluk_values, p=zorluk_probs)
    tur = np.random.choice(tur_values, p=tur_probs)
    cozum = np.random.choice(cozum_values, p=cozum_probs)
    cevap = np.random.choice(cevap_values, p=cevap_probs)

    rows_2026.append({
        "Yıl": yil,
        "Soru No": soru_no,
        "Konu": konu,
        "Alt Konu": alt_konu,
        "Zorluk": zorluk,
        "Tür": tur,
        "Çözüm Yöntemi": cozum,
        "Cevap": cevap,
    })

df_2026 = pd.DataFrame(rows_2026)

print("\n2026 için üretilen veri boyutu:", df_2026.shape)
print(df_2026.head())

# ============================================================
# 5. EXCEL'E KAYDET
# ============================================================

df_2026.to_excel(OUTPUT_FILE, index=False)
print(f"\n>>> 2026 tahmini 1000 soru seti kaydedildi: {OUTPUT_FILE}")
