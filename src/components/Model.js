import React, { useEffect, useState } from "react";
import Card from "./Card";
import {
  BsArrowLeftCircle,
  BsXCircle,
  BsArrowRightCircle,
  BsArrowRight,
  BsArrowDown,
} from "react-icons/bs";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const Model = ({ pokemonName, onClose,onPreviousCard,onNextCard }) => {
  const [pokemon, setPokemon] = useState({});
  const [anchor, setAnchor] = useState(null);
  const openPopover = (event) => {
    setAnchor(event.target.parentNode.parentNode.parentNode.parentNode);
  };

  const closePopover = (event) => {
    setAnchor(null);
  };

  const handleOnClose = () => {
    onClose();
  };

  const changeToPreviousCard=async()=>{onPreviousCard();}
  const changeToNextCard=()=>{onNextCard();}

  useEffect(() => {
    fetchPokemonData(pokemonName);
    // eslint-disable-next-line
  }, []);

  useEffect(()=>{
    fetchPokemonData(pokemonName);
  },[pokemonName])

  const fetchPokemonData = async (pokeName) => {
    let pokemonURL = `https://pokeapi.co/api/v2/pokemon/` + pokeName + `/`;
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
    pokemonInfo["flavorTexts"] = removeDuplicates(
      flavorTexts.map((textObjext) => {
        return textObjext.flavor_text;
      })
    );

    pokemonInfo["flavorTexts"] = formatFlavorText(pokemonInfo["flavorTexts"]);
    // console.log(speciesInfo.evolves_from_species);
    pokemonInfo["evolChain"] = [];
    while (speciesInfo !== null) {
      pokemonInfo["evolChain"].unshift({
        nameInfo: { id: speciesInfo.id, name: speciesInfo.name },
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

  const removeDuplicates = (arr) => {
    console.log(arr);
    console.log(arr.filter((item, index) => arr.indexOf(item) === index));
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };
  const formatFlavorText = (text) => {
    text = text.join(" ").replaceAll("\f", " ");
    return text;
  };

  const shortenedText = (text) => {
    return text.length > 420 ? text.slice(0, 420 - 1) + "... " : text;
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
    <div className="modal fade fixed inset-0 overflow-auto overscroll-none bg-slate-900 bg-opacity-80 backdrop-blur-md flex justify-center z-50">
      <div className="bg-[#deeded] bg-opacity-90 p-4 md:p-10 h-fit max-w-3xl modal-dialog modal-dialog-scrollable relative text-[#2e3159]">
        <div className="flex flex-col-reverse md:flex-row justify-center pb-2">
          <div className="flex md:w-2/5 md:mr-10 justify-center items-center">
            <Card pokemonInfo={{ id: pokemon.id }} image={pokemon.image}></Card>
          </div>

          <div className="flex flex-col w-full mb-4 space-y-6">
            <div className="flex justify-between h-1/3">
              <div className="font-bold font-sans text-2xl">
                {pokemon.name && pokemon.name.toUpperCase()}
              </div>

              <div className="font-sans border-x-2 px-2 md:px-10 border-[#2e3159] text-2xl ">
                {("000" + pokemon.id).slice(-3)}
              </div>

              <div className="grid grid-cols-3 gap-x-2 text-2xl">
                <button>
                  <BsArrowLeftCircle onClick={changeToPreviousCard}/>
                </button>
                <button>
                  <BsXCircle onClick={handleOnClose} />
                </button>
                <button>
                  <BsArrowRightCircle onClick={changeToNextCard}/>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap max-w-xl">
              <p>
                {pokemon.flavorTexts && shortenedText(pokemon.flavorTexts)}
                <Link className="" href="#text-buttons" onClick={openPopover}>
                  read more
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="">
          <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            PaperProps={{
              style: { width: 690 },
            }}
          >
            <Typography
              sx={{ p: 2, bgcolor: "#2e3156", color: "white", fontSize: 13 }}
            >
              <span className="flex space-x-2">
                <span className="flex">{pokemon.flavorTexts}</span>
                <button className="flex" onClick={closePopover}>
                  X
                </button>
              </span>
            </Typography>
          </Popover>
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
            {pokemon.egg_groups &&
              pokemon.egg_groups.map((items) => camelCase(items)).join(", ")}
          </div>

          <div>
            <h3 className="font-bold">Abilities</h3>
            {pokemon.abilities &&
              pokemon.abilities
                .map((ability) => camelCase(ability.ability.name))
                .join(", ")}
          </div>

          <div className="flex flex-col space-y-1">
            <h3 className="font-bold">Types</h3>
            <div className="flex space-x-2">
              {pokemon.types &&
                pokemon.types.map((type) => {
                  return (
                    <span
                      key={type.type.name}
                      className="px-2 border-[1px] rounded-lg border-[#2e3156] bg-[#fcc1b0] text-[#2e3156]"
                    >
                      {camelCase(type.type.name)}
                    </span>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <h3 className="font-bold">Weak Against</h3>
            <div className="flex space-x-2">
              {pokemon.egg_groups &&
                pokemon.egg_groups.map((items) => {
                  return (
                    <span
                      key={items}
                      className="px-2 border-[1px] rounded-lg border-[#2e3156] bg-[#fcc1b0] text-[#2e3156]"
                    >
                      {camelCase(items)}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="p-2 md:p-5 bg-[#b0d2d2] rounded-lg mb-8">
          <h2 className="font-bold text-xl my-4">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {pokemon.stats &&
              pokemon.stats.map((stat) => {
                return (
                  <div className="grid grid-cols-4" key={stat.stat.name}>
                    <span className="">{formatStatText(stat.stat.name)}</span>
                    <div className="col-span-3 h-fill bg-[#93b2b2] m-1 align-baseline">
                      <div
                        className={`object-cover px-2 text-xs text-white bg-[#2e3156]
 `}
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
                  <div
                    key={species.nameInfo.id}
                    className="flex flex-col md:flex-row justify-center items-center"
                  >
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
