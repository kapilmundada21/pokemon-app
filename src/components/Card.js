import React from "react";

function Card({ pokemonInfo, image, selectCard }) {
  const camelCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      key={pokemonInfo.name}
      name={pokemonInfo.name}
      onClick={selectCard}
      className="h-84 text-center border-2 border-dashed rounded-lg p-5 justify-items-center border-black bg-[#edc2c4]"
    >
      <div>
        <img src={image} className="h-36 m-4" alt="pokemon" />
      </div>
      <div className="p-3">
        <h2 className="font-bold">
          {pokemonInfo.name && camelCase(pokemonInfo.name)}
        </h2>
        {pokemonInfo.id && ("000" + pokemonInfo.id).slice(-3)}
      </div>
    </div>
  );
}

export default Card;
