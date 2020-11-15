import React, {useState} from 'react'

//enemies
import enemies from '../assets/enemies.json'

//resources
import hp from '../assets/icons/hp.png'
import mana from '../assets/icons/mana.png'
import gold from '../assets/icons/gold.png'

import bed from '../assets/icons/rest.png'
import backpack from '../assets/icons/inventory.png'
import statsIcon from '../assets/icons/stats.png'
import swords from '../assets/icons/swords.png'

import hpPotion from '../assets/icons/healingPotion.png'
import mpPotion from '../assets/icons/manaPotion.png'

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
      slot: 1,
      item: {
          name: 'Healing Potion',
          description: 'Restores 20 HP',
          image: hpPotion,
          use: true
        },
    },
    {
      slot: 2,
      item: {
        name: 'Mana Potion',
        description: 'Restores 10 MP',
        image: mpPotion,
        use: true
      }
    },
    {
      slot: 3,
      item: {}
    },
    {
      slot: 4,
      item: {}
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
    },
    img: ""
  })

  const [displayEnemy, setDisplayEnemy] = useState(false)

  //msg
  const [msg, setMsg] = useState({
    battle: '',
    gains: '',
    lvlUp: '',
    item: '',
    npc: ''
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
    if (stats.gold < 5) {
      setMsg({npc: 'Sorry. You dont have enough gold!'})
      // alert('Sorry. You dont have enough gold!')
      setTimeout(() => {
        setMsg({npc: ''})
      }, 1500);
      return
    }
    const maxHp = stats.maxHp
    const maxMp = stats.maxMp
    setStats({...stats, hp: maxHp, mp: maxMp, gold: stats.gold-5})
  }

  //clear ui messages
  const clearMsg = () => {
    setMsg({
      battle: '',
      gains: '',
      lvlUp: '',
      npc: ''
    })
    setDisplayEnemy(false)
  }

  const usItem = (e, item, i) => {
    e.preventDefault()
    console.log(item)
    console.log(i)
 

    // if (item.name === 'Healing Potion') {
    //   let recovery = stats.hp+5
    //   if (recovery <= stats.maxHp) {
    //     setStats({...stats, hp: recovery})
    //   } else {
    //     //if the amount of health is greater than maxhp the hp will be the same as maxhp
    //     setStats({...stats, hp: stats.maxHp})
    //   }
    // }

    switch (item.name) {
      case 'Healing Potion':
        let healingPotion = stats.hp+20
        if (healingPotion <= stats.maxHp) {
          setStats({...stats, hp: healingPotion})
        } else {
          //if the amount of health is greater than maxhp the hp will be the same as maxhp
          setStats({...stats, hp: stats.maxHp})
        }
      break;

      case 'Mana Potion':
        let manaPotion = stats.mp+10
        if(manaPotion <= stats.maxMp) {
          setStats({...stats, mp: manaPotion})
        } else {
          setStats({...stats, mp: stats.maxMp})
        }
      break;
    
      default:
    }

    //destroy the item after use
    let itms = [...inventory]
      let itm = {...inventory[i]}
      itm.item = {}
      itms[i] = itm
      console.log(itms)
      setInventory([...itms]) 

  }


  const closeEverything = () => {
    setDisplay(false)
    setDisplayInv(false)
  }

  

  return (
    <div className="container">
      <div className="playerUI">
        <h3>{name} LVL {stats.lvl}</h3>
        <p><img className="playerUI-img" src={hp} alt=""/>HP {stats.hp}/{stats.maxHp}</p>
        <p><img className="playerUI-img" src={mana} alt=""/>MP {stats.mp}/{stats.maxMp}</p>
        <p><img className="playerUI-img" src={gold} alt=""/>Gold: {stats.gold}</p>
      </div>
      {msg.npc ? 
        <React.Fragment>
          <div className="message-box">
            <p>{msg.npc}</p>
          </div>
        </React.Fragment>: null}
 

      {displayEnemy ? null :
        <div className="options-menu">
          
         <button onClick={(e) => {if(window.confirm('Want to spend the night for 5 gold?')) rest(e)}}>
           <img className="options-img" src={bed} alt=""/>
            {/* Rest */}
          </button>
          <button onClick={displayInventory}>
            <img className="options-img" src={backpack} alt=""/>
              {/* Inventory */}
          </button>
          <button onClick={displayStats}>
            <img className="options-img" src={statsIcon} alt=""/>
              {/* Stats */}
          </button><br/>
        </div>}
      

      {/* display inventory */}
      {displayInv ? 
        <div className="inventory">
          {/* <p>Inventory slots {inventory.length}</p> */}
          {inventory.map((inv, i) => (
            
            <div key={i} className="inv">
              {inv.item.name !== undefined ? 
              <div>
              <p>{inv.item.name}</p>
              <img className="inventory-img" src={inv.item.image} alt=""/>
              <div className="item-desc">{inv.item.description}</div>
              {inv.item.use ? <button className="item-btn" onClick={e => usItem(e, inv.item, i)}>Use</button> : null}
              </div>
              : null}
            </div>
            
          ))}
        </div>
        : null }
      
      {/* display stats */}
      {display ? 
      <div className="stats">
        <p>Level: {stats.lvl}</p>
        <p>HP: {stats.hp}/{stats.maxHp}</p>
        <p>MP: {stats.mp}/{stats.maxMp}</p>
        <p>ATK: {stats.atk}</p>
        <p>DEF: {stats.def}</p>
        <p>EXP to next LVL: {stats.exp}</p>
      </div> 
      : null}
    
      {msg.battle ? null : 
        <button className="battle-btn" onClick={battle}>
          <img className="options-img" onClick={closeEverything} src={swords} alt=""/>
            {/* Battle */}
        </button>}
      {displayEnemy && enemyStats.stats.hp > 0 ? 
      <div className="battle">
        <div className="enemy-info">
          <h3>{enemyStats.name}</h3>
          <p>Hp: {enemyStats.stats.hp}/{enemyStats.stats.maxHp}</p>
          <img src={require(`../assets/enemies/${enemyStats.img}`)} alt="" className="enemy-img"/>
        </div>

        {/* battle actions / buttons */}
        <div className="battle-actions">
          <div>
            <p className="cursor">►</p>
            <button onClick={attack}>Attack</button>
          </div>
          <div >
            <p className="cursor">►</p>
            <button onClick={displayInventory}>Item</button>

          </div>
          <div >
            <p className="cursor">►</p>
            <button>Magic</button>
            </div>
          <div>
            <p className="cursor">►</p>
            <button>Flee</button>
          </div>
           {/*escape with money*/}
        </div>
        
      </div>
      : null}

      {/* messages after battle */}
      {msg.battle ? 
      <div className="message-box">
        <p>{msg.battle}</p>
        <p>{msg.gains}</p>
        <p>{msg.lvlUp}</p>
        <button onClick={clearMsg}>Close</button>
      </div>: null}

    </div>
  )
}

export default Player
