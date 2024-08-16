# Crash Endpoint

To calculate the cash out point in a crash game, we typically use a provably fair algorithm that ensures the game is fair and transparent. Here's a simplified explanation of how you might calculate the cash out point.


1. Provably Fair Algorithm:
- Private Seed: A server-generated random seed that is kept secret until the game ends.
- Public Seed: A random seed obtained from a blockchain network hash function that will combine with the private seed.
- Hash Function: A cryptographic hash function (e.g., SHA-256) is used to combine the seeds and generate a random number.

2. Crash Point Calculation:
- The crash point is determined by the combined seeds and the hash function. The result is a number that represents the multiplier at which the game will crash.


## Example Calculation

1. Generate Seeds:
- Private Seed: server_seed
- Public Seed: client_seed
2. Combine Seeds:
- Combined Seed: combined_seed = server_seed + client_seed
3. Hash the Combined Seed:
- Hash: hash = SHA-256(combined_seed)
4. Convert Hash to a Number:
- Convert the hash to a decimal number.
5. Calculate Crash Point:
- Use the decimal number to determine the crash point. For example:



## Code Example
Here's a simplified example in JavaScript:
```javascript
const crypto = require('crypto');

function calculateCrashPoint(serverSeed, clientSeed) {
  //
}

// Example usage
const serverSeed = 'server_random_seed';
const clientSeed = 'client_random_seed';
const crashPoint = calculateCrashPoint(serverSeed, clientSeed);
console.log('Crash Point:', crashPoint);
```