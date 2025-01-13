export default function PDFViewer({pdfURL} : {pdfURL: string}) {
    return <iframe src={pdfURL} className="w-full h-full">
          
    </iframe>
}