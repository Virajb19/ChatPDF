export default function PDFViewer({pdfURL} : {pdfURL: string}) {
    return <iframe src={`https://docs.google.com/gview?url=${pdfURL}&embedded=true`} className="w-full h-full">
          
    </iframe>
}