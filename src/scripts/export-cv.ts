import puppeteer from 'puppeteer';
import path from 'path';

const exportCV = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filePath = path.resolve(__dirname, '../../dist/cv/index.html');
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    await page.addStyleTag({ content: pdfStyle });

    const savePath = path.resolve(__dirname, '../../dist/cv/cv.pdf');

    await page.pdf({
        path: savePath,
        format: 'A4',
        margin: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in',
        },
    });

    console.log(`PDF generated at ${savePath}`);

    await browser.close();
};

const pdfStyle = `
  body {
    font-size: 12px;
  }
  details {
    display: none;
  }
  footer {
    margin-top: 1em;
    float: right;
    text-align: right;
  }
  nav a {
    display: none;
  }
  .print {
    display: block !important;
  }
  .not-print {
    display: none;
  }
  footer a,
  .print a {
    color: rgb(60, 60, 120) !important;
  }
  a {
    text-decoration: none;
  }
  a::after {
    content: '' !important;
  }
  hr {
    border-top: 0.5px solid rgba(0, 0, 0, 0.5) !important;
    border-bottom: none !important;
  }
  blockquote,
  blockquote p {
      display: block;
  }
`;

exportCV();