module.exports = str => {
  try {
    const [HH, MM, SS, ms] = str.split(/[:.]/g);
    return +HH * 3600 + +MM * 60 + +SS;
  } catch (error) {
    return 0
  }
}
