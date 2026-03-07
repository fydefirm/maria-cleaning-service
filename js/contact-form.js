// Form submission
document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      service: document.getElementById("service").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      message: document.getElementById("message").value,
    };

    try {
      // Send to backend API
      const response = await fetch(
        "https://purple-forest-0cca19f0f.2.azurestaticapps.net/api/contact",
        {
          // http://localhost:3000/api/contact (url for local testing)
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(
          "✅ Thank you for your booking request! We will contact you shortly.",
        );
        this.reset();
      } else {
        alert(
          "❌ " + (result.error || "Something went wrong. Please try again."),
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "❌ Unable to send request. Please ensure the backend server is running or try again later.",
      );
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
