export default (title: string): string =>
  `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500&display=swap" rel="stylesheet">
      <title>${title}</title>
      <style>
        body{
          font-family: 'Montserrat', sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          height: 100vh;
          margin: 0;
          padding-top: 20vh;
          box-sizing: border-box;
          font-family: 'Nanum Gothic', sans-serif;
          background: #f3f5f6;
        }
    
        .box-container {
          background: white;
          padding: 5vh;
          width: 80%;
          max-width: 400px;
          margin: 0 auto;
        }
    
        .btn {
          display: block;
          padding: 11px;
          border-radius: .2rem;
          text-align: center;
          text-decoration: none;
        }
    
        .btn-primary {
          background-color: #1e9999;
        }
        .text-primary{
          color: #1e9999;
        }
    
        .mt-5 {
          margin-top: 5vh;
        }
    
      </style>
    </head>
    <body>
    `;
