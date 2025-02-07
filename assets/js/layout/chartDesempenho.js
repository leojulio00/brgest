const ctx = document.querySelector(".chartDesempenho");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 10, 3],
        borderWidth: 1,
        borderColor: "#423DCC",
        backgroundColor: "#423DCC",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
