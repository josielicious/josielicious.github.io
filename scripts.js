fetch('data/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    });

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("projects-container");

    if (!container) return;
    fetch("data/simulators.json")
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                const card = document.createElement("a");
                card.className = "sim-card";
                card.href = project.link;

                card.innerHTML = `
                    <img src="${project.image}" loading="lazy" oncontextmenu="return false;">
                    <h3 style="color:${project.color}; text-shadow: 0 0 2px ${project.color}">${project.title}</h3>
                    <p>${project.description}</p>
                `;

                container.appendChild(card);
            });
        })
});