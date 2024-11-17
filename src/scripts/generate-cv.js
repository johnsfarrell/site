const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filePath = path.resolve(__dirname, 'dist/cv/index.html');
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    await page.addStyleTag({
        content: `
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
        `,
    });

    await page.pdf({
        path: 'cv.pdf',
        format: 'A4',
        margin: {
            top: '0.5in',    
            right: '0.5in',  
            bottom: '0.5in', 
            left: '0.5in',   
        },
    });

    console.log('PDF generated successfully at cv.pdf!');
    await browser.close();
})();
