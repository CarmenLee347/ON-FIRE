// Helper functions to display or hide a loading spinner
function show_loading() {
  document.getElementById("loading").removeAttribute("hidden");
}

function hide_loading() {
  document.getElementById("loading").setAttribute("hidden", true);
}

// Reset the form and remove the image and generated text
function clear_data() {
  const status_div = document.getElementById("image_status");
  status_div.innerHTML = "";
  const id_div = document.getElementById("image_id");
  id_div.innerHTML = "";
  const check_button = document.getElementById("check");
  check_button.setAttribute("disabled", true);
  document.getElementById("text_container").innerHTML = "";
  document.getElementById("user_image").setAttribute("src", "");
}

// Helper to show the generated text and display the uploaded image
function display_data(data) {
  const status_div = document.getElementById("image_status");
  status_div.innerHTML = `<p>${data.status}</p>`;
  if (data.image_id !== undefined) {
    document.getElementById("image_id").innerHTML = `<p>${data.image_id}</p>`;
  }
  if (data.text !== undefined) {
    document.getElementById("text_container").innerHTML = `<p>${data.text}</p>`;
  }
  if (data.image_url !== undefined) {
    document.getElementById("user_image").setAttribute("src", data.image_url);
  }
  const check_button = document.getElementById("check");
  check_button.removeAttribute("disabled");
}

// This is the main function that runs when the user submits the form
function handleSubmit(event) {
  event.preventDefault();
  clear_data();
  show_loading();
  const form = document.getElementById("image-upload-form");
  const formData = new FormData(form);
  const url = form.getAttribute("action");
  const fetchOptions = {
    method: form.getAttribute("method"),
    body: formData,
  };

  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      display_data(data);
      check_until_complete();
    });
}

// Check whether the text generation has completed
function check_status() {
  const image_id = document.getElementById("image_id").innerText;
  const url = `/i2t/api/status/${image_id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      display_data(data);
    });
}

// Keep checking for the most recent text generation until it is finished
function check_until_complete() {
  const image_id = document.getElementById("image_id").innerText;
  const url = `/i2t/api/status/${image_id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "Processing") {
        setTimeout(check_until_complete, 2000);
      } else {
        display_data(data);
        hide_loading();
      }
    });
}

// Setup when the page loads, attach the handleSubmit function to the form.
const form = document.getElementById("image-upload-form");
form.addEventListener("submit", handleSubmit);

document.getElementById("check").addEventListener("click", check_status);