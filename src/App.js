import { useState, useEffect } from "react";
import { Model } from "./components/Model";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Card from "./components/Card";

function App() {
  const [openModel, setOpenModel] = useState(false);
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [selectedPokemonName, setSelectedPokemonName] = useState("");
  const [statsDropdown, setStatsDropdown] = useState(false);
  const [typeDropDown, setTypeDropDown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [genderInput, setGenderInput] = useState("Male");
  const [filteredResult, setFilteredResult] = useState([]);
  const [statsInput, setStatsInput] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    "special-attack": 0,
    "special-defense": 0,
  });

  const resetStats = () => {
    setStatsInput({
      hp: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      "special-attack": 0,
      "special-defense": 0,
    });
    setFilteredResult([]);
    setTypeInput("");
    setSearchInput("");
  };

  const fetchData = async () => {
    let mainURL = `https://pokeapi.co/api/v2/pokemon/`;
    let mainData = await fetch(mainURL);
    let mainParsedData = await mainData.json();
    await setAllPokemonData(
      await Promise.all(
        mainParsedData["results"] &&
          mainParsedData["results"].map(async (pokemon) => {
            return await getPokemonDataforFilters(pokemon.url);
          })
      )
    );
    await setFilteredResult(allPokemonData);
  };

  const toggleModel = (event) => {
    if (selectedPokemonName === "")
      setSelectedPokemonName(event.currentTarget.getAttribute("name"));
    else setSelectedPokemonName("");
    setOpenModel(!openModel);
  };

  const toggleStatsDropdown = () => {
    setStatsDropdown(!statsDropdown);
    if (statsDropdown === true) {
      setTypeDropDown(false);
      setTypeInput([]);
      var get = document.getElementsByName("type");
      for (var i = 0; i < get.length; i++) {
        get[i].checked = false;
      }
    }
  };

  const toggleTypeDropDown = () => {
    setTypeDropDown(!typeDropDown);
    if (typeDropDown === true) setStatsDropdown(false);
    resetStats();
  };

  const typeUIDropdown = () => {
    document.getElementById("typeUIDropdown").classList.toggle("hidden")
  }
  const genderUIDropdown = () => {
    document.getElementById("genderUIDropdown").classList.toggle("hidden")
  }

  const getPokemonDataforFilters = async (pokemonURL) => {
    let pokemonInformation = await (await fetch(pokemonURL)).json();
    const pokemonInfo = {
      id: pokemonInformation.id,
      name: pokemonInformation.name,
      stats: {},
      types: [],
    };

    pokemonInformation.stats.forEach((statInfo) => {
      pokemonInfo.stats[statInfo.stat.name] = statInfo.base_stat;
    });

    pokemonInformation.types.forEach((type) => {
      pokemonInfo.types = [...pokemonInfo.types, type.type.name];
    });
    return pokemonInfo;
  };

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, []);
  const arr = allPokemonData;

  const handelChange = async (e) => {
    if (e.target.name === "search") {
      await setSearchInput(e.target.value);
      setFilteredResult(
        allPokemonData.filter((item) => item.name.includes((e.target.value).toLowerCase()))
      );
    } else if (e.target.name === "type") {
      await setTypeInput(e.target.value);
      setFilteredResult([
        ...allPokemonData.filter((item) => item.types.includes(e.target.value)),
      ]);
      if(e.target.value === "all"){
        setTypeInput("");
      }
    } else if (e.target.name === "gender") {
      setGenderInput(e.target.value);
      setFilteredResult(allPokemonData);
    } else if (
      e.target.name === "hp" ||
      e.target.name === "attack" ||
      e.target.name === "defense" ||
      e.target.name === "speed" ||
      e.target.name === "special-attack" ||
      e.target.name === "special-defense"
    ) {
      await setStatsInput({
        ...statsInput,
        [e.target.name]: e.target.value,
      });

      setFilteredResult(
        allPokemonData.filter((item) => {
          return e.target.value >= item.stats[e.target.name];
        })
      );
    }
  };

  return (
    <>
      {openModel && (
        <Model pokemonName={selectedPokemonName} onClose={toggleModel} />
      )}
      <div className="p-4 md:p-10 bg-[#deeded]">
        <nav className="mb-16 space-y-4">
          <div className="flex flex-col md:flex-row items-center">
            <h1 className="p-2 md:p-4 border-r-2 md:border-black text-3xl font-bold">
              Pokemon App
            </h1>
            <span className="p-2 md:p-4">
              Search for any Pokemon that exist on Planet
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{gridTemplateColumns : "3fr 1fr 1fr 1fr"}}>
            <div className="flex flex-col w-full space-y-2">
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
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Type</label>

              <div className="">
                <button className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full" onClick={typeUIDropdown}> 
                  <span>All <span className="font-bold">+5 More</span></span>
                  <IoIosArrowDown />
                </button>
                <div id="typeUIDropdown" className="hidden ml-2 p-2 w-56 bg-[#c9dde2] absolute top-52">
                  <ul className="">
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="all"/><span> All</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="normal"/><span> Normal</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="poison"/><span> Poison</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="fire"/><span> Fire</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="water"/><span> Water</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="bug"/><span> Bug</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="type" onChange={handelChange} value="flying"/><span> Flying</span></li>
                  </ul>
                </div>
              </div>

              {/* <select
                name="type"
                id="type"
                className="bg-[#c9dde2] p-3 rounded-lg w-full"
                value={typeInput}
                onChange={handelChange}
              >
                <option value="all">All</option>
                <option value="normal">Normal</option>
                <option value="poison">Poison</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="bug">Bug</option>
                <option value="flying">Flying</option>
              </select> */}
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Gender</label>

              <div className="">
                <button className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full" onClick={genderUIDropdown}> 
                  <span>Male <span className="font-bold">+5 More</span></span>
                  <IoIosArrowDown />
                </button>
                <div id="genderUIDropdown" className="hidden ml-2 p-2 w-56 bg-[#c9dde2] absolute top-52">
                  <ul className="">
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="gender" onChange={handelChange} value="male"/><span> Male</span></li>
                    <li className="flex space-x-2 items-center"><input type="checkbox" id="" name="gender" onChange={handelChange} value="female"/><span> Female</span></li>
                  </ul>
                </div>
              </div>

              {/* <select
                name="gender"
                id="gender"
                className="bg-[#c9dde2] p-3 rounded-lg w-full"
                value={genderInput}
                onChange={handelChange}
              >
                <option value="male">Male +2 More</option>
                <option value="female">Female</option>
              </select> */}
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Stats</label>
              <button
                onClick={() => {
                  toggleStatsDropdown() && toggleTypeDropDown();
                }}
                className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full text-left"
              >
                <div>HP <span className="font-bold">+5 More</span></div> <IoIosArrowDown />{" "}
              </button>
            </div>
          </div>
          {statsDropdown && (
            <div className="absolute top-30 md:top-[28%] right-3 md:right-10 z-10 border-2 border-black bg-white">
              <div className="p-6">
                <div className="flex justify-between pb-6">
                  <span className="font-bold text-xl">Select Stats</span>
                  <button
                    onClick={() => {
                      toggleStatsDropdown();
                    }}
                  >
                    <AiOutlineCloseCircle className="text-xl" />
                  </button>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">HP</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="hp"
                      id="hp"
                      className="md:w-72"
                      value={statsInput.hp}
                      onChange={handelChange}
                    />
                    <span>{statsInput.hp}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">Attack</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="attack"
                      id="attack"
                      className="md:w-72"
                      value={statsInput.attack}
                      onChange={handelChange}
                    />
                    <span>{statsInput.attack}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">Defense</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="defense"
                      id="defense"
                      className="md:w-72"
                      value={statsInput.defense}
                      onChange={handelChange}
                    />
                    <span>{statsInput.defense}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">Speed</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="speed"
                      id="speed"
                      className="md:w-72"
                      value={statsInput.speed}
                      onChange={handelChange}
                    />
                    <span>{statsInput.speed}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">Sp. Attack</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="special-attack"
                      id="special-attack"
                      className="ml-6 md:w-72"
                      value={statsInput["special-attack"]}
                      onChange={handelChange}
                    />
                    <span>{statsInput["special-attack"]}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <label htmlFor="type">Sp. Def</label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      name="special-defense"
                      id="special-defense"
                      className="md:w-72"
                      value={statsInput["special-defense"]}
                      onChange={handelChange}
                    />
                    <span>{statsInput["special-defense"]}</span>
                  </div>
                </div>
                <div className="pt-3 space-x-4 flex justify-end">
                  <button
                    type="reset"
                    onClick={resetStats}
                    className="py-1 px-2 border-2 border-blue-700 rounded-lg text-blue-700 items-center"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="py-1 px-3 border-2 border-blue-700 rounded-lg bg-blue-700 text-white items-center"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8">
          {arr &&
          !searchInput.length &&
          !typeInput.length &&
          !filteredResult.length
            && arr.map((items) => {
                return (
                  <Card
                    key={items.id}
                    pokemonInfo={{ id: items.id, ...items }}
                    image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${items.id}.svg`}
                    selectCard={toggleModel}
                  ></Card>
                );
              })
            }

            { filteredResult
            && filteredResult.map((items, index) => {
                return (
                  <Card
                    key={items.id}
                    pokemonInfo={{ id: items.id, ...items }}
                    image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${items.id}.svg`}
                    selectCard={toggleModel}
                  ></Card>
                );
              })
              }
        </div>
      </div>
    </>
  );
}

export default App;
