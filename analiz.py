import pandas as pd

# ----------------- AYARLAR -----------------
# Lütfen Excel dosyanızın adını buraya tam olarak yazın
EXCEL_DOSYA_ADI = "uslusayilar.xlsx" 

# Excel dosyanızdaki sütun adları (Eğer değiştirirseniz buradan düzeltin)
COZUM_YONTEMI_SUTUNU = "Çözüm Yöntemi"
ALT_KONU_SUTUNU = "Alt Konu"
# -------------------------------------------

try:
    # 1. Excel dosyasını oku
    df = pd.read_excel(EXCEL_DOSYA_ADI)
    print(f"'{EXCEL_DOSYA_ADI}' dosyası başarıyla okundu.\n")

    # --- YÖNTEM 1 (Basit Frekans Sayımı) ---
    # 'Çözüm Yöntemi' sütunundaki her biricik değeri sayar.
    if COZUM_YONTEMI_SUTUNU in df.columns:
        print("--- 'Çözüm Yöntemi' Frekansları (YÖNTEM 1) ---")
        cozum_yontemi_frekans = df[COZUM_YONTEMI_SUTUNU].value_counts()
        print(cozum_yontemi_frekans)
        print("-" * 40)
    else:
        print(f"UYARI: '{COZUM_YONTEMI_SUTUNU}' adında bir sütun bulunamadı.")


    # --- YÖNTEM 2 (Çoklu Etiketli Frekans Sayımı) ---
    # 'Alt Konu' sütunundaki virgülle ayrılmış etiketleri sayar.
    if ALT_KONU_SUTUNU in df.columns:
        print("\n--- 'Alt Konu' (Multi-Label) Frekansları (YÖNTEM 2) ---")
        
        # 1. Her hücreyi ', ' (virgül ve boşluk) ile ayırarak listelere böl
        # 2. .explode() ile her liste elemanını ayrı bir satıra dönüştür
        # 3. .value_counts() ile her bir etiketin toplam sayısını bul
        
        alt_konu_frekans = df[ALT_KONU_SUTUNU].str.split(', ').explode().value_counts()
        
        print(alt_konu_frekans)
        print("-" * 40)
    else:
        print(f"UYARI: '{ALT_KONU_SUTUNU}' adında bir sütun bulunamadı.")

except FileNotFoundError:
    print(f"HATA: '{EXCEL_DOSYA_ADI}' adında bir dosya bulunamadı.")
    print("Lütfen dosya adını kontrol edin ve kodun Excel ile aynı klasörde olduğundan emin olun.")
except Exception as e:
    print(f"Bir hata oluştu: {e}")