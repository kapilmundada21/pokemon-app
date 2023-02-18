import React, { useEffect, useState } from "react";
import Card from "./Card";
import {
  BsArrowLeftCircle,
  BsXCircle,
  BsArrowRightCircle,
  BsArrowRight,
  BsArrowDown
} from "react-icons/bs";

export const Model = ({ pokemonName, onClose }) => {
  const [pokemon, setPokemon] = useState({});

  const handleOnClose = () => {
    onClose();
  };

  useEffect(() => {
    fetchPokemonData(pokemonName);
    // eslint-disable-next-line
  }, []);

  const fetchPokemonData = async () => {
    let pokemonURL = `https://pokeapi.co/api/v2/pokemon/` + pokemonName + `/`;
    let pokemonInformation = await (await fetch(pokemonURL)).json();
    const pokemonInfo = (({
      sprites: {
        other: {
          dream_world: { front_default: image },
        },
      },
      id,
      name,
      species,
      height,
      weight,
      abilities,
      types,
      stats,
    }) => ({
      image,
      id,
      name,
      species,
      height,
      weight,
      abilities,
      types,
      stats,
    }))(pokemonInformation);

    let speciesInfo = await (await fetch(pokemonInfo.species.url)).json();

    pokemonInfo["egg_groups"] = speciesInfo.egg_groups.map((egg_group) => {
      return egg_group.name;
    });

    let flavorTexts = speciesInfo.flavor_text_entries.filter((textObjext) => {
      return textObjext.language.name === "en";
    });
    pokemonInfo["flavorTexts"] = flavorTexts.map((textObjext) => {
      return textObjext.flavor_text;
    });

    // console.log(speciesInfo.evolves_from_species);
    pokemonInfo["evolChain"] = [];
    while (speciesInfo !== null) {
      pokemonInfo["evolChain"].unshift({
        nameInfo: { id: speciesInfo.id, ...speciesInfo.name },
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" +
          speciesInfo.id +
          ".svg",
      });
      speciesInfo = speciesInfo.evolves_from_species
        ? await (await fetch(speciesInfo.evolves_from_species.url)).json()
        : null;
    }
    setPokemon(pokemonInfo);
    // console.log(pokemonInfo);
  };

  const shortenedText = (text) => {
    text = text.replaceAll("\f", " ");
    return text.length > 320 ? text.slice(0, 320 - 1) + "..." : text;
  };

  const formatStatText = (str) => {
    str = str.replace("special-", "Sp. ");
    if (str.includes("Sp.")) str = str.replace("defense", "Def.");
    str = str.replace("attack", "Attack");
    return camelCase(str);
  };

  const camelCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="modal fade fixed inset-0 overflow-auto overscroll-none bg-slate-900 bg-opacity-80 backdrop-blur-md flex justify-center ">
      <div className="bg-[#deeded] bg-opacity-90 p-4 md:p-10 h-fit max-w-3xl modal-dialog modal-dialog-scrollable relative  text-indigo-900">

        <div className="flex flex-col-reverse md:flex-row justify-center items-center">
          <div className="flex md:w-1/3 mr-10">
            <Card pokemonInfo={{}} image={pokemon.image}></Card>
          </div>

          <div className="flex flex-col w-full gap-y-10 mb-8">
            <div className="flex justify-between h-1/3">
              <div className="font-bold font-sans text-2xl">
                {pokemon.name && pokemon.name.toUpperCase()}
              </div>

              <div className="font-sans border-x-2 px-2 md:px-10 border-indigo-900 text-2xl ">
                {("000" + pokemon.id).slice(-3)}
              </div>

              <div className="grid grid-cols-3 gap-x-2 text-2xl">
                <button>
                  <BsArrowLeftCircle />
                </button>
                <button>
                  <BsXCircle onClick={handleOnClose} />
                </button>
                <button>
                  <BsArrowRightCircle />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap max-w-xl">
              {pokemon.flavorTexts &&
                shortenedText(pokemon.flavorTexts.join(" "))}
            </div>
          </div>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-x-8 my-8">
          <div className="">
            <h3 className="font-bold">Height</h3>
            {pokemon.height}
          </div>

          <div className="">
            <h3 className="font-bold">Weight</h3>
            {pokemon.weight / 10 + "Kg"}
          </div>

          <div className="">
            <h3 className="font-bold">Egg Groups</h3>
            {pokemon.egg_groups && pokemon.egg_groups.join(", ")}
          </div>

          <div>
            <h3 className="font-bold">Abilities</h3>
            {pokemon.abilities &&
              pokemon.abilities
                .map((ability) => camelCase(ability.ability.name))
                .join(", ")}
          </div>

          <div>
            <h3 className="font-bold">Types</h3>
            <span className="px-2 border-[1px] rounded-lg border-[#2e3156] bg-[#fcc1b0] text-[#2e3156]">
              {pokemon.types &&
                pokemon.types
                  .map((type) => camelCase(type.type.name))
                  .join(" ")}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <h3 className="font-bold">Weak Against</h3>
            <div className="flex space-x-2">
              {pokemon.egg_groups &&
                pokemon.egg_groups.map((items) => {
                  return (
                    <span className="px-2 border-[1px] rounded-lg border-[#2e3156] bg-[#fcc1b0] text-[#2e3156]">
                      {camelCase(items)}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="p-2 md:p-5 bg-[#b0d2d2] rounded-lg mb-8">
          <h2 className="font-bold text-1xl my-4">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {pokemon.stats &&
              pokemon.stats.map((stat) => {
                return (
                  <div className="grid grid-cols-4" key={stat.stat.name}>
                    <span className="">{formatStatText(stat.stat.name)}</span>
                    <div className="col-span-3 h-fill bg-gray-200 m-1 align-baseline">
                      <div
                        className={`object-cover px-2 text-xs text-white bg-indigo-900 `}
                        style={{ width: stat.base_stat + "%" }}
                      >
                        {stat.base_stat}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-xl">Evolution Chain</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 my-4">
            {pokemon.evolChain &&
              pokemon.evolChain.map((species, index) => {
                return (
                  <div key={species.nameInfo.id} className="flex flex-col md:flex-row justify-center items-center">
                    <Card
                      pokemonInfo={species.nameInfo}
                      image={species.image}
                    ></Card>
                    {index !== pokemon.evolChain.length - 1 ? (
                      <div>
                        <BsArrowRight className="text-5xl mx-5 h-full hidden md:block" />
                        <BsArrowDown className="text-5xl mx-5 h-full md:hidden" />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
