import React, {useState} from 'react'

//enemies
import enemies from '../assets/enemies.json'

//picture
import player from '../assets/pics/player.jpg'

const Player = () => {
  //player
  const [name, setName] = useState('Hero')
  const [stats, setStats] = useState({
    lvl: 1,
    hp: 20,
    maxHp: 20,
    mp: 0,
    maxMp: 0,
    atk: 5,
    def: 5,
    exp: 10,
    gold: 0
  })
  const [display, setDisplay] = useState(false)
  
  //inventory
  const [inventory, setInventory] = useState([
    {
      name: 'Healing Potion',
      description: 'Restores 20 HP',
      use: true
    },
    {
      name: 'Mana Potion',
      description: 'Restores 10 MP',
      use: true
    },
    {
    },
    {
    }
  ])

  // //check inventory
  
  //   for (let i = 0; i < inventory.length; i++) {
  //     console.log(inventory[i])
      
  //   }
    

  const [displayInv, setDisplayInv] = useState(false)
  
  //enemy
  const [enemyStats, setEnemyStats] = useState({
    name: "",
    stats: {
      lvl: '',
      hp: '',
      maxHp: '',
      mp: '',
      maxMp: '',
      atk: '',
      def: '',
      exp: '',
      gold: ''
    }
  })

  const [displayEnemy, setDisplayEnemy] = useState(false)

  //msg
  const [msg, setMsg] = useState({
    battle: '',
    gains: '',
    lvlUp: '',
    item: ''
  })


  //functions
  //choose a random enemy from the enemies array
  const randomEnemy = () => {
    const random = Math.floor(Math.random() * enemies.enemies.length)
    console.log(random, enemies.enemies[random])
    setEnemyStats(enemies.enemies[random])
  }

  //display player stats
  const displayStats = () => {
    setDisplayInv(false)
    setDisplay(!display)
  }

  //display player inventory
  const displayInventory = () => {
    setDisplay(false)
    setDisplayInv(!displayInv)
  }

  //start an encounter/battle
  const battle = () => {
    randomEnemy()
    // clearMsg()
    setDisplayEnemy(true)
  }

  //player attack 
  const attack = () => {
    let hp = enemyStats.stats.hp - (stats.atk-enemyStats.stats.def)
    //https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
    //Olamigoke Philip answer
    setEnemyStats((prevState) => ({
      ...prevState,
      stats: {
        ...prevState.stats,
        hp
      }
    }))
    if (hp <= 0 ) {
      getExp(enemyStats.stats.exp, enemyStats.stats.gold)
     
      return
    }
    enemyAtk()

  }

  //enemy turn
  const enemyAtk = () => {
    let hp = stats.hp - (enemyStats.stats.atk)
    setStats({...stats, hp})
    if (hp <= 0) {
      setStats({...stats, hp: 0})
      setMsg({battle: 'Game Over'})
    }
  }

  //get experience/lvl up, and gold
  const getExp = (exp, gold) => {
    let xp = stats.exp - exp
    console.log(xp)
    if (xp <= 0 ) {
      let exp = (10*(stats.lvl+1))-(Math.abs(xp))
      console.log(exp)
      setStats({
        ...stats, 
        maxHp: stats.maxHp+2,
        maxMp: stats.maxMp+2,
        atk: stats.atk+1,
        def: stats.def+1,
        lvl: stats.lvl+1,
        gold: stats.gold+gold,
        exp
      })
      // setStats({...stats, lvl: stats.lvl+1, exp})
      setMsg({
        battle: 'Enemy is Dead',
        gains: `You gain ${enemyStats.stats.exp} EXP and ${gold} gold coins`,
        lvlUp: `${name} just leveled up to lvl ${stats.lvl+1}`
      })
      return
    }
    setStats({...stats, exp: xp, gold: stats.gold+gold})
    setMsg({
      battle: 'Enemy is Dead',
      gains: `You gain ${enemyStats.stats.exp} EXP and ${gold} gold coins`
    })
    return
  }

  //rest
  const rest = () => {
    const maxHp = stats.maxHp
    setStats({...stats, hp: maxHp})
  }

  //clear ui messages
  const clearMsg = () => {
    setMsg({
      battle: '',
      gains: '',
      lvlUp: ''
    })
    setDisplayEnemy(false)
  }

  

  return (
    <div className="container">
      <h3>{name} LVL {stats.lvl}</h3>
      <p>HP {stats.hp}/{stats.maxHp}</p>
      <p>MP {stats.mp}/{stats.maxMp}</p>
      <p>Gold: {stats.gold}</p>
 

      {displayEnemy ? null :
        <div>
          <button onClick={rest}>Rest</button>
          <button onClick={displayInventory}>Inventory</button>
          <button onClick={displayStats}>Stats</button><br/>
        </div>}
      

      {/* display inventory */}
      {displayInv ? 
        <div>
          <p>inventory slots {inventory.length}</p>
          {inventory.map((item, i) => (
            <React.Fragment key={i}>
              <p>{item.name}</p>
              {item.use ? <button>Use</button> : null}
            </React.Fragment>
          ))}
        </div>
        : null }
      
      {/* display stats */}
      {display ? 
      <div>
        <p>Level: {stats.lvl}</p>
        <p>HP: {stats.hp}/{stats.maxHp}</p>
        <p>MP: {stats.mp}/{stats.maxMp}</p>
        <p>ATK: {stats.atk}</p>
        <p>DEF: {stats.def}</p>
        <p>EXP to next LVL: {stats.exp}</p>
      </div> 
      : null}
    
      {msg.battle ? null : <button onClick={battle}>Battle</button>}
      {displayEnemy && enemyStats.stats.hp > 0 ? 
      <div>
        <h3>{enemyStats.name}</h3>
        <p>Hp: {enemyStats.stats.hp}/{enemyStats.stats.maxHp}</p>
        <button onClick={attack}>Attack</button>
        <button>Item</button>
        <button>Magic</button>
        <button>Flee</button>  {/*escape with money*/}
        
      </div>
      : null}

      {msg.battle ? 
      <div>
        <p>{msg.battle}</p>
        <p>{msg.gains}</p>
        <p>{msg.lvlUp}</p>
        <button onClick={clearMsg}>Done</button>
      </div>: null}

    </div>
  )
}

export default Player
