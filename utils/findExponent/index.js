module.exports = x => {
  for (let n = 1; n <= 10; n++) {
    const multiplier = Math.pow(10, (Math.log10(x) / n));
    // console.log({ n, multiplier });
    if (0.5 <= multiplier && multiplier <= 2) {
      return { n, multiplier };
    }
  }
  throw new Error(`Could not find a multiple in the range 1-10`);
}


/**

2^(3) = 8
log_2(8) = 3

a^b = c
log_a(c) = b

x^3=y
log x^3 = log y
3 log x = log y
log x = (log y)/3

10^((log y)/3) = x

*/
