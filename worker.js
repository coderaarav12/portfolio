export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/app_tutorials" || url.pathname === "/app_tutorials/") {
      return Response.redirect(
        "https://drive.google.com/drive/folders/1sqvi_gx5YjGuF1VCUn9n7HH1EY-EXN7_?usp=sharing",
        302,
      );
    }

    return env.ASSETS.fetch(request);
  },
};
