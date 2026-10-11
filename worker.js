export default {
  async fetch(req) {
    const name = decodeURIComponent(new URL(req.url).pathname.slice(1));

    if (!/\.(apk|zip)$/i.test(name) || name.includes("/") || name.includes("..")) {
      return new Response("File tidak ditemukan", { status: 404 });
    }

    const alias = { "adin-preset-finder.apk": "Adin Preset Finder.apk" };
    const real = alias[name] || name;

    const target = "https://github.com/fhadiltulus/adinhub-files/raw/main/" + encodeURIComponent(real);
    const r = await fetch(target);
    if (!r.ok) return new Response("Gagal mengambil file: " + r.status, { status: 502 });

    const type = /\.zip$/i.test(name) ? "application/zip" : "application/vnd.android.package-archive";
    return new Response(r.body, {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="[AdinHub] ${name}"`,
      },
    });
  },
};
