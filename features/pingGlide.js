import Settings from "../settings"

register('command', () => Settings.openGUI() ).setName('b').setAliases(['bling']);
let recentTimeout;
let timeoutId = 0;

register("packetSent", (packet, event) => {
  if (packet.func_180762_c().toString().includes("START") && Player.lookingAt().toString().includes('glass')) {
    let currentId = ++timeoutId; // Increment the timeoutId for each new timeout set

    if (recentTimeout) {
      clearTimeout(recentTimeout); // Clear the previous timeout
    }

    recentTimeout = setTimeout(function(id) {
      return function() {
        if (id === timeoutId) {
          World.playSound(Settings.pingGlideSound, parseFloat(Settings.vol) / 100, 1);
        }
        else{
          cancel(event)
        }
      };
    }(currentId), Settings.del);

  }
}).setFilteredClass(net.minecraft.network.play.client.C07PacketPlayerDigging);

//working on a way to disable it during msb but for now just totally ignore this

// export function capitalizeFirst(sentence) {
//     if (sentence == undefined) return sentence
//     let words = sentence.split(" ")
//     let capitalized = words.map(word => {
//         return word[0].toUpperCase() + word.slice(1)
//     })

//     return capitalized.join(" ")
// }

// register("chat", (abilityName, event) => {
//   selectedAbility = capitalizeFirst(abilityName)
//   addAbility(abilityName)
// }).setCriteria(/&r&aYou used your &r&6(.+) &r&aPickaxe Ability!&r/g)


// register("worldLoad", () => {
//   activeAbilities.forEach(ability => {
//       ability.timer = ability.maxTimer/2
// Chatlib.chat(ability.timer)
//   })
// })