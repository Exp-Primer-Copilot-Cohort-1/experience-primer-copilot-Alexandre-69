function skillsMember() {
    var skills = document.getElementById("skills").value;
    var skillsError = document.getElementById("skillsError");
    if (skills == "") {
        skillsError.innerHTML = "Skills is required";
        return false;
    } else {
        skillsError.innerHTML = "";
        return true;
    }
}