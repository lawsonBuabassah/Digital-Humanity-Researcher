document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submitBtn");
    const userPromptInput = document.getElementById("userPrompt");
    const myForm = document.querySelector(".myForm"); // Get the form element

    submitButton.addEventListener("click", function (event) {
        if (userPromptInput.value.trim() !== "") {
            // Set the button text to "Loading..."
            submitButton.innerText = "Loading...";

            // You can optionally disable the button to prevent multiple submissions:
            submitButton.disabled = true;

            // Submit the form after changing the button text
            myForm.submit();
        } else {
            // If the input is empty, prevent form submission
            event.preventDefault();
        }
    });
});


