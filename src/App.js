import { useState, useEffect } from "react";
import { Model } from "./components/Model";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Card from "./components/Card";

function App() {
  const [pokemonApi, setPokemonApi] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [selectedPokemonName, setSelectedPokemonName] = useState("");
  const [statsDropdown, setStatsDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("Normal");
  const [genderInput, setGenderInput] = useState("Male");
  const [searchArr, setSearchArr] = useState(undefined);
  const [filterResult, setFilterResult] = useState([]);
  const [statsFilter, setStatsFilter] = useState([]);
  const [allStats, setAllStats] = useState({})
  const [statsInput, setStatsInput] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    spAttack: 0,
    spDefense: 0,
  });
  
  const resetStats = () => {
    setStatsInput({
      hp : 0,
      attack : 0,
      defense : 0,
      speed : 0,
      spAttack : 0,
      spDefense : 0
    })
    setStatsFilter([]);
  }

  const fetchData = async () => {
    let mainURL = `https://pokeapi.co/api/v2/pokemon/`;
    let mainData = await fetch(mainURL);
    let mainParsedData = await mainData.json();
    setPokemonApi(mainParsedData);
  };

  const fetchStats = async (pokemonName) => {
    let pokemonURL = `https://pokeapi.co/api/v2/pokemon/` + pokemonName + `/`;
    let pokemonInfo = await (await fetch(pokemonURL)).json();
    setAllStats({
      ...allStats,
      ...pokemonInfo.stats
    });
  }

  const toggleModel = (event) => {
    if (selectedPokemonName === "")
      setSelectedPokemonName(event.currentTarget.getAttribute("name"));
    else setSelectedPokemonName("");
    setOpenModel(!openModel);
  };

  const toggleStatsDropdown = () => {
    setStatsDropdown(!statsDropdown);
  };

  const filterArray = [
    {"id": 1, "name": "bulbasaur", "type": "poison", "stats" : {hp:4, attack:4, defense:4, speed:4, spAttack:4, spDefense:4}},
    {"id": 2, "name": "ivysaur", "type": "poison", "stats" : {hp:8, attack:8, defense:8, speed:8, spAttack:8, spDefense:8}},
    {"id": 3, "name": "venusaur", "type": "poison", "stats" : {hp:12, attack:12, defense:12, speed:12, spAttack:12, spDefense:12}},
    {"id": 4, "name": "charmander", "type": "fire", "stats" : {hp:16, attack:16, defense:16, speed:16, spAttack:16, spDefense:16}},
    {"id": 5, "name": "charmeleon", "type": "fire", "stats" : {hp:20, attack:20, defense:20, speed:20, spAttack:20, spDefense:20}},
    {"id": 6, "name": "charizard", "type": "flying", "stats" : {hp:24, attack:24, defense:24, speed:24, spAttack:24, spDefense:24}},
    {"id": 7, "name": "squirtle", "type": "water", "stats" : {hp:28, attack:28, defense:28, speed:28, spAttack:28, spDefense:28}},
    {"id": 8, "name": "wartortle", "type": "water", "stats" : {hp:32, attack:32, defense:32, speed:32, spAttack:32, spDefense:32}},
    {"id": 9, "name": "blastoise", "type": "water", "stats" : {hp:36, attack:36, defense:36, speed:36, spAttack:36, spDefense:36}},
    {"id": 10, "name": "caterpie", "type": "bug", "stats" : {hp:40, attack:40, defense:40, speed:40, spAttack:40, spDefense:40}},
    {"id": 11, "name": "metapod", "type": "bug", "stats" : {hp:44, attack:44, defense:44, speed:44, spAttack:44, spDefense:44}},
    {"id": 12, "name": "butterfree", "type": "flying", "stats" : {hp:48, attack:48, defense:48, speed:48, spAttack:48, spDefense:48}},
    {"id": 13, "name": "weedle", "type": "poison", "stats" : {hp:52, attack:52, defense:52, speed:52, spAttack:52, spDefense:52}},
    {"id": 14, "name": "kakuna", "type": "poison", "stats" : {hp:56, attack:56, defense:56, speed:56, spAttack:56, spDefense:56}},
    {"id": 15, "name": "beedrill", "type": "poison", "stats" : {hp:60, attack:60, defense:60, speed:60, spAttack:60, spDefense:60}},
    {"id": 16, "name": "pidgey", "type": "flying", "stats" : {hp:64, attack:64, defense:64, speed:64, spAttack:64, spDefense:64}},
    {"id": 17, "name": "pidgeotto", "type": "flying", "stats" : {hp:68, attack:68, defense:68, speed:68, spAttack:68, spDefense:68}},
    {"id": 18, "name": "pidgeot", "type": "flying", "stats" : {hp:72, attack:72, defense:72, speed:72, spAttack:72, spDefense:72}},
    {"id": 19, "name": "rattata", "type": "", "stats" : {hp:76, attack:76, defense:76, speed:76, spAttack:76, spDefense:76}},
    {"id": 20, "name": "raticate", "type": "", "stats" : {hp:80, attack:80, defense:80, speed:80, spAttack:80, spDefense:80}}
];

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, []);
  const arr = pokemonApi.results;

  const handelChange = (e) => {
    if (e.target.name === "search") {
      setSearchInput(e.target.value);
      setSearchArr((filterArray.find((o) => o.name === e.target.value)) || (filterArray.find((o) => (o.id).toString() === e.target.value)));
    } else if (e.target.name === "type") {
      setTypeInput(e.target.value);
      setFilterResult( filterArray.filter( item => item.type === e.target.value) )
    } else if (e.target.name === "gender") {
      setGenderInput(e.target.value);
    } else if (e.target.name === "hp") {
      setStatsInput({
        ...statsInput,
        hp: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.hp) );
    } else if (e.target.name === "attack") {
      setStatsInput({
        ...statsInput,
        attack: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.attack) );
    } else if (e.target.name === "defense") {
      setStatsInput({
        ...statsInput,
        defense: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.defense) );
    } else if (e.target.name === "speed") {
      setStatsInput({
        ...statsInput,
        speed: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.speed) );
    } else if (e.target.name === "sp-attack") {
      setStatsInput({
        ...statsInput,
        spAttack: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.spAttack) );
    } else if (e.target.name === "sp-def") {
      setStatsInput({
        ...statsInput,
        spDefense: e.target.value,
      });
      setStatsFilter( filterArray.filter( item => e.target.value >= item.stats.spDefense) );
    }
  };

  return (
    <>
      {openModel && (
        <Model pokemonName={selectedPokemonName} onClose={toggleModel} />
      )}
      <div className="p-10 bg-[#deeded]">
        <nav className="mb-16 space-y-4">
          <div className="flex items-center">
            <h1 className="p-4 border-r-2 border-black text-3xl font-bold">
              Pokemon App
            </h1>
            <span className="p-4">
              Search for any Pokemon that exist on Planet
            </span>
          </div>
          <div className="flex space-x-10">
            <div className="flex flex-col w-2/5 space-y-2">
              <label htmlFor="search">Search by</label>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Name"
                value={searchInput}
                onChange={handelChange}
                className="bg-[#c9dde2] p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col w-1/5 space-y-2">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                id="type"
                className="bg-[#c9dde2] p-3 rounded-lg w-full"
                value={typeInput}
                onChange={handelChange}
              >
                <option value="normal">Normal</option>
                <option value="poison">Poison</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="bug">bug</option>
                <option value="flying">Flying</option>
              </select>
            </div>
            <div className="flex flex-col w-1/5 space-y-2">
              <label htmlFor="type">Gender</label>
              <select
                name="gender"
                id="gender"
                className="bg-[#c9dde2] p-3 rounded-lg w-full"
                value={genderInput}
                onChange={handelChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col w-1/5 space-y-2">
              <label htmlFor="type">Stats</label>
              <button
                onClick={() => {
                  toggleStatsDropdown();
                }}
                className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full text-left"
              >
                HP +5 More <IoIosArrowDown />{" "}
              </button>
            </div>
          </div>
          {statsDropdown && <div className="absolute top-[28%] right-10 z-10 border-2 border-black bg-white">
          <div className="p-6">
            <div className="flex justify-between pb-6">
              <span className="font-bold text-xl">Select Stats</span>
              <button onClick={()=>{toggleStatsDropdown()}}><AiOutlineCloseCircle className="text-xl" /></button>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">HP</label>
              <div className="flex space-x-2">
                <input type="range" name="hp" id="hp" className="w-72" value={statsInput.hp} onChange={handelChange} />
                <span>{statsInput.hp}</span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Attack</label>
              <div className="flex space-x-2">
                <input type="range" name="attack" id="attack" className="w-72" value={statsInput.attack} onChange={handelChange} />
                <span>{statsInput.attack}</span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Defense</label>
              <div className="flex space-x-2">
                <input type="range" name="defense" id="defense" className="w-72" value={statsInput.defense} onChange={handelChange} />
                <span>{statsInput.defense}</span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Speed</label>
              <div className="flex space-x-2">
                <input type="range" name="speed" id="speed" className="w-72" value={statsInput.speed} onChange={handelChange} />
                <span>{statsInput.speed}</span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Sp. Attack</label>
              <div className="flex space-x-2">
                <input type="range" name="sp-attack" id="sp-attack" className="ml-6 w-72" value={statsInput.spAttack} onChange={handelChange} />
                <span>{statsInput.spAttack}</span>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <label htmlFor="type">Sp. Def</label>
              <div className="flex space-x-2">
                <input type="range" name="sp-def" id="sp-def" className="w-72" value={statsInput.spDefense} onChange={handelChange} />
                <span>{statsInput.spDefense}</span>
              </div>
            </div>
            <div className="pt-3 space-x-4 flex justify-end">
              <button type="reset" onClick={resetStats} className="py-1 px-2 border-2 border-blue-700 rounded-lg text-blue-700 items-center">Reset</button>
              <button type="button" className="py-1 px-3 border-2 border-blue-700 rounded-lg bg-blue-700 text-white items-center">Apply</button>
            </div>
          </div>
        </div>}
        </nav>

        <div className="grid grid-cols-6 gap-8">
          {arr &&
            !(statsFilter.length) &&
            !(filterResult.length) &&
            !searchArr &&
            arr.map((items, index) => {
              return (
                <Card
                  key={index + 1}
                  pokemonInfo={{ id: index + 1, ...items }}
                  image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                    index + 1
                  }.svg`}
                  selectCard={toggleModel}
                ></Card>
              );
            })}

          {(statsFilter.length > 0) &&
            !(filterResult.length) &&
            !searchArr &&
            statsFilter.map((items, index) => {
              return (
                <Card
                  key={index + 1}
                  pokemonInfo={{ id: index + 1, ...items }}
                  image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                    index + 1
                  }.svg`}
                  selectCard={toggleModel}
                ></Card>
              );
            })}
     
          {filterResult &&
            filterResult.map((items, index) => {
              return (
                <Card
                  key={index + 1}
                  pokemonInfo={{ id: index + 1, ...items }}
                  image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                    index + 1
                  }.svg`}
                  selectCard={toggleModel}
                ></Card>
              );
            })}
     
          {searchArr && (
            <div
              key={searchArr.name}
              className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg border-black bg-[#edc2c4]"
            >
              <button onClick={toggleModel} className="">
                <div className="my-4">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${searchArr.id}.svg`}
                    height="150px"
                    width="150px"
                    alt="pokemon"
                  />
                </div>
                <div className="text-center pb-4 flex flex-col">
                  <span className="font-bold">{searchArr.name}</span>
                  <span>{searchArr.id}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
