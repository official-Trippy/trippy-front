// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
//     async rewrites() {
//       return [
//         {
//           source: "/oauth2/authorize/:providerType",
//           destination: "http://localhost:8080/oauth2/authorize/:providerType?redirect_uri=http://localhost:3000/api/auth/callback/:providerType",
//         },
//         {
//           source: "/api/auth/callback/:providerType",
//           destination: "http://localhost:8080/oauth2/authorize/:providerType?redirect_uri=http://localhost:3000/api/auth/callback/:providerType",
//         },
//       ];
//     },
//   };

//   export default nextConfig;

// export async function rewrites() {
//     return [
//         {
//             source: '/oauth2/authorize/:provider',
//             destination: 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=8d4f58c6adf8693fb3251884f300c395&scope=profile_nickname%20profile_image%20account_email&state=vHXY-CN_ViXFYVK2OOCbHKh7UYqxRLXqJ0E5ThAkEyg%3D&redirect_uri=http://localhost:8080/login/oauth2/code/:provider',
//         },
//     ];
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // swcMinify: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: "/:path*",
  //       destination: "http://localhost:8080/:path*",
  //     },
  //   ];
  // },
  images: {
    domains: ['axjoaeuyezzj.objectstorage.ap-chuncheon-1.oci.customer-oci.com'],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
