const createObstacle = (id, x = 1000, type, height, poscY) => ({
  id,
  x,
  height,
  type,
  poscY,
});
export const createInitialObstacles = (idCurrent, heigth) => [
  createObstacle(idCurrent, 1000, "cactus", heigth, 2),
];

export const getCactusHeight = () =>
  Math.floor(Math.random() * (30 - 20 + 1) + 20);
export const colision = (obj, dinoYRef, isDuckingRef) => {
  return obj.some((enemies) => {
    let cactusLeft = enemies.x + 4;
    let cactusRigth = enemies.x + 22;
    let dinoLetft = 10;
    let dinoRigth = dinoLetft + 32;
    //eje X
    const colisionX = dinoRigth > cactusLeft && cactusRigth > dinoLetft;
    //eje Y
    const dinoBottom = dinoYRef.current;
    const dinoTop = isDuckingRef.current
      ? dinoYRef.current + 16
      : dinoYRef.current + 32;
    const enemiesTop = enemies.poscY + enemies.height - 6;
    const enemiesBottom = enemies.poscY;
    const colisionY = enemiesTop > dinoBottom && enemiesBottom < dinoTop;

    return colisionX && colisionY;
  });
};
export const calculateVelocity = (score) => {
  let nuevaVelocidad = 3; // Empezamos con un valor base

  // Rango 1: 100 a 200
  if (score >= 100 && score <= 200) {
    nuevaVelocidad = 4; // O nuevaVelocidad += 1 si quieres incrementar el valor base
  }
  // Rango 2: 200 a 400 (Nota: El rango anterior ya cubre 200, revisa tus límites)
  else if (score >= 200 && score <= 400) {
    nuevaVelocidad = 5;
  }
  // Rango 3: 400 a 600
  else if (score >= 400 && score <= 600) {
    nuevaVelocidad = 6;
  }
  // Rango 4: Mayor que 600
  else if (score > 600) {
    nuevaVelocidad = 7;
  }
  // Si no cumple ninguna condición, mantiene el valor base (3)

  return nuevaVelocidad;
};
// Esto podría ir en gameHelper
export function getRandomSpawnInterval() {
  return Math.floor(Math.random() * (140 - 60 + 1)) + 60;
}
export const updateObstacles = (prev, velocity) => {
  if (!prev.length) return prev;
  return prev
    .map((obstacles) => {
      return {
        ...obstacles,
        x: obstacles.x - calculateVelocity(velocity),
      };
    })
    .filter((obstacles) => obstacles.x > -80);
};
const caculatePoscY = () => Math.floor(Math.random() * (40 - 10 + 1)) + 10;

function createBird(id, type) {
  return createObstacle(id, 1000, "bird", 30, caculatePoscY());
}
function createCactus(id) {
  return createObstacle(id, 1000, "cactus", getCactusHeight(), 2);
}
export function getRandomEnemyType(id) {
  const dado = Math.floor(Math.random() * 100 + 1);
  return dado <= 70 ? createCactus(id) : createBird(id);
}
