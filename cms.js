
fetch("cms-data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load CMS data.");
        }

        return response.json();
    })
    .then(cmsSystems => {
        const tableBody = document.getElementById("cms-table-body");

        tableBody.innerHTML = "";

        cmsSystems.forEach(cms => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><strong>${cms.name}</strong></td>

                <td>${cms.support}</td>

                <td>${cms.technology}</td>

                <td>${cms.capabilities}</td>

                <td>${cms.limitations}</td>

                <td>
                    <a href="${cms.example}"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${cms.exampleName}
                    </a>

                    <br><br>

                    <strong>Research Sources:</strong>
                    <ul>
                        ${cms.sources.map(source => `
                            <li>
                                <a href="${source.url}"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    ${source.label}
                                </a>
                            </li>
                        `).join("")}
                    </ul>
                </td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        document.getElementById("error-message").textContent =
            "Error loading the CMS information. Make sure cms-data.json and cms.js are in the correct location.";

        document.getElementById("cms-table-body").innerHTML =
            "<tr><td colspan='6'>Unable to load information.</td></tr>";

        console.error(error);
    });
