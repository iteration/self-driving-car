const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1), 10000, 30, 50, "keyboard");

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    cars.forEach((car, index) => {
        car.brain = JSON.parse(localStorage.getItem("bestBrain"));

        if (index != 0) {
            console.info("Mutated: 🧠 " + car.brain.id);
            NeuralNetwork.mutate(car.brain, 0.2);
        }
    });
    console.info("Cloned: 🧠 " + cars[0].brain.id);
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), 400, 30, 50, "DUMMY", 7),
    new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", 1),
    new Car(road.getLaneCenter(2), -2500, 30, 50, "DUMMY", 2.5),
];

animate();

function save() {
    const id = uuidv4();
    console.info("Saving: 🥇🧠 " + id);
    bestCar.brain.id = id;
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

function discard() {
    console.info("Discarding: 🤯");
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

console.info("🏁 Start your engines! 🏁");

function animate(time) {
    traffic.map((c) => c.update(road.borders, []));

    cars.map((car) => car.update(road.borders, traffic));

    bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    traffic.map((c) => c.draw(carCtx));

    carCtx.globalAlpha = 0.2;
    cars.map((car) => car.draw(carCtx, "blue"));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "green", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 25;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
