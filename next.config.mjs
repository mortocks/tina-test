import withSvgr from "next-svgr";

export default withSvgr({
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
