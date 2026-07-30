const form = document.getElementById("settings-form");
const status = document.getElementById("status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const settings = {
    displayName: data.get("displayName"),
    email: data.get("email"),
    theme: data.get("theme"),
    emailNotifications: data.get("emailNotifications") === "on",
    weeklyDigest: data.get("weeklyDigest") === "on",
  };

  console.log("Saved settings:", settings);

  status.textContent = "Settings saved.";
  status.hidden = false;
});
