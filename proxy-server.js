const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  let target;

  // 클라이언트의 요청에 따라 적절한 타겟 URL 설정
  if (req.url.includes("/oauth2/authorize/google")) {
    target = "https://accounts.google.com";
  } else if (req.url.includes("/oauth2/authorize/naver")) {
    target = "https://nid.naver.com";
  } else if (req.url.includes("/oauth2/authorize/kakao")) {
    target = "https://kauth.kakao.com";
  }

  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // 프록시 서버에서 요청을 처리하고 응답을 클라이언트에게 전달
  proxy.web(req, res, { target });

  // 프록시 서버에서 백엔드로 요청을 보내기 전에 백엔드 응답의 CORS 헤더를 확인하고 클라이언트로 전달하기 전에 CORS 헤더를 추가
  proxy.on("proxyRes", function (proxyRes, req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  });
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});

// 에러 핸들링
proxy.on("error", (err, req, res) => {
  console.error(err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Something went wrong. Please try again later.");
});
