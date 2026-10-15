const files = import.meta.glob("../assets/**/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

// getAsset("locations/dhaka") returns the URL of src/assets/locations/dhaka.(jpg|png|webp...) or null
export const getAsset = (name) => {
  const key = Object.keys(files).find((k) => k.includes(`/assets/${name}.`));
  return key ? files[key] : null;
};