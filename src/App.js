import { useState, useEffect } from "react";
import { Model } from "./components/Model";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import Card from "./components/Card";
import RangeSlider from "./components/RangeSlider";

function App() {
  const [openModel, setOpenModel] = useState(false);
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [pokemonsData, setPokemonsData] = useState([]);
  const [selectedPokemonName, setSelectedPokemonName] = useState("");
  const [statsDropdown, setStatsDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState([
    "normal",
    "poison",
    "fire",
    "water",
    "bug",
    "flying",
  ]);
  //eslint-disable-next-line
  const [genderInput, setGenderInput] = useState("Male");
  const [filteredResult, setFilteredResult] = useState([]);
  const [statsInput, setStatsInput] = useState({
    hp: [70, 150],
    attack: [70, 150],
    defense: [70, 150],
    speed: [70, 150],
    "special-attack": [70, 150],
    "special-defense": [70, 150],
  });

  const searchButton = () => {
    document.getElementById("search").focus()
  }

  const resetStats = () => {
    setStatsInput({
      hp: [70, 150],
      attack: [70, 150],
      defense: [70, 150],
      speed: [70, 150],
      "special-attack": [70, 150],
      "special-defense": [70, 150],
    });
    setFilteredResult(pokemonsData);
    setSearchInput("");
  };

  const fetchData = async () => {
    let mainURL = `https://pokeapi.co/api/v2/pokemon/`;
    let mainData = await fetch(mainURL);
    let mainParsedData = await mainData.json();
    setAllPokemonData(
      await Promise.all(
        mainParsedData["results"] &&
          mainParsedData["results"].map(async (pokemon) => {
            return await getPokemonDataforFilters(pokemon.url);
          })
      )
    );
  };

  const toggleModel = (event) => {
    if (selectedPokemonName === "")
      setSelectedPokemonName(event.currentTarget.getAttribute("name"));
    else setSelectedPokemonName("");
    setOpenModel(!openModel);
  };

  const toggleStatsDropdown = () => {
    document.getElementById("statsDropdownButton").classList.toggle("bg-white")
    document.getElementById("statsDropdownButton").classList.toggle("bg-[#c9dde2]")
    setStatsDropdown(!statsDropdown);
    if (statsDropdown === true) {
      setTypeDropDown(false);
      var get = document.getElementsByName("type");
      for (var i = 0; i < get.length; i++) {
        get[i].checked = false;
      }
    }
  };
  const typeUIDropdown = () => {
    document.getElementById("typeUIDropdown").classList.toggle("hidden");
    document.getElementById("typeUIDropdownButton").classList.toggle("bg-white");
    document.getElementById("typeUIDropdownButton").classList.toggle("bg-[#c9dde2]");
  };
  const genderUIDropdown = () => {
    document.getElementById("genderUIDropdown").classList.toggle("hidden");
    document.getElementById("genderUIDropdownButton").classList.add("bg-white");
    document.getElementById("genderUIDropdownButton").classList.remove("bg-[#c9dde2]");
  };

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
  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (typeInput.length === 0)
      setTypeInput(["normal", "poison", "fire", "water", "bug", "flying"]);
    let newPokemonsData = [];
    typeInput.forEach((element) => {
      newPokemonsData = [
        ...newPokemonsData,
        ...allPokemonData.filter((item) => item.types.includes(element)),
      ];
    });
    setPokemonsData(removeDuplicates(newPokemonsData));
    console.log(pokemonsData);
    resetStats();
    //eslint-disable-next-line
  }, [typeInput]);

  useEffect(() => {
    setPokemonsData(allPokemonData);
  }, [allPokemonData]);

  useEffect(() => {
    setFilteredResult(pokemonsData);
  }, [pokemonsData]);

  const applyFilters = () => {
    setFilteredResult(
      pokemonsData.filter((item) => {
        let satifies = true;
        Object.entries(statsInput).forEach(([statName, statValues]) => {
          if (
            !(
              statValues[0] <= item.stats[statName] &&
              statValues[1] >= item.stats[statName]
            )
          )
            satifies = false;
        });
        return satifies === true;
      })
    );
  };
  const handelChange = async (e) => {
    if (e.target.name === "search") {
      await setSearchInput(e.target.value);
      setFilteredResult(
        pokemonsData.filter((item) =>
          item.name.includes(e.target.value.toLowerCase())
        )
      );
    } else if (e.target.name === "type") {
      if (typeInput.includes(e.target.value)) {
        setTypeInput(typeInput.filter((type) => type !== e.target.value));
      } else if (!typeInput.includes(e.target.value)) {
        setTypeInput([...typeInput, e.target.value]);
      }
    } else if (e.target.name === "gender") {
      setGenderInput(e.target.value);
      setFilteredResult(pokemonsData);
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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="md:col-span-3 flex flex-col w-full space-y-2">
              <label htmlFor="search">Search by</label>
              <div className="bg-[#c9dde2] rounded-lg flex items-center w-full space-x-2 pr-3">
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Name"
                  value={searchInput}
                  onChange={handelChange}
                  className="bg-[#c9dde2] p-3 rounded-lg w-full"
                />
                <BsSearch className="bg-transparent text-black" onClick={searchButton} />
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Type</label>

              <div className="">
                <button
                  className="flex justify-between items-center bg-[#c9dde2] py-3 px-1 md:p-3 rounded-lg w-full"
                  onClick={typeUIDropdown}
                  id="typeUIDropdownButton"
                >
                  <span>
                    Normal <span className="font-bold">+5 More</span>
                  </span>
                  <IoIosArrowDown />
                </button>
                <div
                  id="typeUIDropdown"
                  className="hidden p-2 w-40 md:w-56 bg-white absolute top-52 rounded-lg"
                >
                  <ul className="">
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="normal"
                        checked={typeInput.includes("normal")}
                      />
                      <span> Normal</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="poison"
                        checked={typeInput.includes("poison")}
                      />
                      <span> Poison</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="fire"
                        checked={typeInput.includes("fire")}
                      />
                      <span> Fire</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="water"
                        checked={typeInput.includes("water")}
                      />
                      <span> Water</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="bug"
                        checked={typeInput.includes("bug")}
                      />
                      <span> Bug</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="type"
                        onChange={handelChange}
                        value="flying"
                        checked={typeInput.includes("flying")}
                      />
                      <span> Flying</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Gender</label>

              <div className="">
                <button
                  className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full"
                  onClick={genderUIDropdown}
                  id="genderUIDropdownButton"
                >
                  <span>
                    Male <span className="font-bold">+2 More</span>
                  </span>
                  <IoIosArrowDown />
                </button>
                <div
                  id="genderUIDropdown"
                  className="hidden p-2 w-40 md:w-56 bg-white absolute top-52 rounded-lg"
                >
                  <ul className="">
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="gender"
                        onChange={handelChange}
                        value="male"
                      />
                      <span> Male</span>
                    </li>
                    <li className="flex space-x-2 items-center">
                      <input
                        type="checkbox"
                        id=""
                        name="gender"
                        onChange={handelChange}
                        value="female"
                      />
                      <span> Female</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="type">Stats</label>
              <button
                onClick={() => {
                  toggleStatsDropdown();
                }}
                className="flex justify-between items-center bg-[#c9dde2] p-3 rounded-lg w-full text-left"
                id="statsDropdownButton"
              >
                <div>
                  HP <span className="font-bold">+5 More</span>
                </div>{" "}
                <IoIosArrowDown />{" "}
              </button>
            </div>
          </div>
          {statsDropdown && (
            <div className="absolute top-30 md:top-[28%] right-3 md:right-10 z-10 border-2 border-black bg-white">
              <div className="p-6">
                <div className="flex justify-between pb-10">
                  <span className="font-bold text-xl">Select Stats</span>
                  <button
                    onClick={() => {
                      toggleStatsDropdown();
                    }}
                  >
                    <AiOutlineCloseCircle className="text-xl" />
                  </button>
                </div>
                <div className="">
                  <RangeSlider
                    title="HP"
                    type="range"
                    name="hp"
                    id="hp"
                    value={statsInput.hp}
                    onChange={handelChange}
                  ></RangeSlider>
                  <RangeSlider
                    title="Attack"
                    type="range"
                    name="attack"
                    id="attack"
                    value={statsInput.attack}
                    onChange={handelChange}
                  ></RangeSlider>
                  <RangeSlider
                    title="Defense"
                    type="range"
                    name="defense"
                    id="defense"
                    value={statsInput.defense}
                    onChange={handelChange}
                  ></RangeSlider>
                  <RangeSlider
                    title="Speed"
                    type="range"
                    name="speed"
                    id="speed"
                    value={statsInput.speed}
                    onChange={handelChange}
                  ></RangeSlider>
                  <RangeSlider
                    title="Sp. Attack"
                    type="range"
                    name="special-attack"
                    id="special-attack"
                    value={statsInput["special-attack"]}
                    onChange={handelChange}
                  ></RangeSlider>
                  <RangeSlider
                    title="Sp. Def"
                    type="range"
                    name="special-defense"
                    id="special-defense"
                    value={statsInput["special-defense"]}
                    onChange={handelChange}
                  ></RangeSlider>
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
                    onClick={applyFilters}
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
          {filteredResult &&
            filteredResult.map((items, index) => {
              return (
                <Card
                  key={items.id}
                  pokemonInfo={{ id: items.id, ...items }}
                  image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${items.id}.svg`}
                  selectCard={toggleModel}
                ></Card>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default App;
