const fs = require('fs');
const path = require('path');

const translations = {
  "en": "All image, audio, video, and document processing is done on your device. No file size limit and no ads.",
  "es": "El procesamiento de todas las imágenes, audio, video y documentos se realiza en tu dispositivo. Sin límite de tamaño de archivo y sin anuncios.",
  "fr": "Le traitement des images, de l'audio, de la vidéo et des documents s'effectue sur votre appareil. Aucune limite de taille de fichier et aucune publicité.",
  "de": "Die gesamte Bild-, Audio-, Video- und Dokumentenverarbeitung erfolgt auf deinem Gerät. Keine Dateigrößenbeschränkung und keine Werbung.",
  "it": "L'elaborazione di immagini, audio, video e documenti avviene sul tuo dispositivo. Nessun limite di dimensione del file e nessuna pubblicità.",
  "pt-BR": "Todo o processamento de imagem, áudio, vídeo e documentos é feito no seu dispositivo. Sem limite de tamanho de arquivo e sem anúncios.",
  "ja": "すべての画像、音声、動画、ドキュメントの処理はデバイス上で行われます。ファイルサイズの制限や広告はありません。",
  "ko": "모든 이미지, 오디오, 비디오 및 문서 처리는 기기에서 수행됩니다. 파일 크기 제한과 광고가 없습니다.",
  "zh-Hans": "所有图像、音频、视频和文档处理均在您的设备上完成。没有文件大小限制，也没有广告。",
  "zh-Hant": "所有圖像、音訊、影片和文件處理均在您的裝置上完成。沒有檔案大小限制，也沒有廣告。",
  "tr": "Tüm görüntü, ses, video ve belge işleme işlemleri cihazınızda yapılır. Dosya boyutu sınırı ve reklam yoktur.",
  "id": "Semua pemrosesan gambar, audio, video, dan dokumen dilakukan di perangkat Anda. Tanpa batas ukuran file dan tanpa iklan.",
  "hr": "Sva obrada slika, zvuka, videa i dokumenata odvija se na vašem uređaju. Nema ograničenja veličine datoteke i nema reklama.",
  "el": "Όλη η επεξεργασία εικόνας, ήχου, βίντεο και εγγράφων γίνεται στη συσκευή σας. Χωρίς όριο μεγέθους αρχείου και χωρίς διαφημίσεις.",
  "ba": "Sva obrada slika, zvuka, videa i dokumenata odvija se na vašem uređaju. Nema ograničenja veličine datoteke i nema reklama."
};

const dir = path.join(__dirname, 'messages');
for (const locale of Object.keys(translations)) {
  const file = path.join(dir, `${locale}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data.index && data.index.subtitle !== undefined) {
      data.index.subtitle = translations[locale];
      fs.writeFileSync(file, JSON.stringify(data, null, '\t') + '\n');
      console.log(`Updated ${locale}.json`);
    } else {
      console.log(`Warning: Subtitle path not found in ${locale}.json`);
    }
  } else {
    console.log(`File not found: ${locale}.json`);
  }
}
