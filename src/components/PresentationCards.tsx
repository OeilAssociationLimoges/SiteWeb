import type { Component } from "solid-js";

import PresentationCard from "./PresentationCard";
import PresentationCardWhois from "./PresentationCardWhois";

/**
 * Les cartes de présentation des membres de l'OEIL.
 *
 * Chaque carte contient une photo, le nom et le prénom du membre,
 * son rôle au sein de l'OEIL, et une courte description.
 *
 * Elles defilent automatiquement en scrollant tout en restant
 * figées au milieu de la page.
 */
const PresentationCards: Component = () => {
  return (
    <section class="overflow-hidden bg-black min-h-screen h-full relative pt-10vh">
      <h2 data-scroll data-scroll-speed="0.1" data-scroll-css-progress class="text-white text-3xl font-mono text-center absolute top-20vh inset-x-0"
        data-scroll-offset="10%, 30%"
        style={{
          opacity: "calc(var(--progress))",
        }}
      >
        # Les membres
      </h2>

      <PresentationCard title="Présidence" image="/MEMBRES/PRESIDENCE.png">
        <PresentationCardWhois name="Florian CLAUX" role="Vice Président" left />
        <PresentationCardWhois name="Maxence VINCENT" role="Président" right />
      </PresentationCard>
      <PresentationCard title="Trésorerie" image="/MEMBRES/TRESORERIE.png">
        <PresentationCardWhois name="Noah TILLEUIL" role="Vice Trésorier" left />
        <PresentationCardWhois name="Evan GERBEAUD" role="Trésorier" right />
      </PresentationCard>
      <PresentationCard title="Secrétariat" image="/MEMBRES/SECRETARIAT.png">
        <PresentationCardWhois name="Mathis ROUFFANCHE" role="Vice Secrétaire" left />
        <PresentationCardWhois name="Marine GENDRY" role="Secrétaire & graphiste (absente)" right />
      </PresentationCard>
      <PresentationCard title="Communication" image="/MEMBRES/COMMUNICATION.png">
        <PresentationCardWhois name="Cathy DESCOUTURES" role="Responsable événement et communication" center />
      </PresentationCard>
      <PresentationCard title="Développement" image="/MEMBRES/DEVELOPPEMENT.png">
        <PresentationCardWhois name="Malo PERROT" role="Développeur" left />
        <PresentationCardWhois name="Yaniss LASBORDES" role="Développeur & chef de projet" right />
      </PresentationCard>
      <PresentationCard title="Collaborateurs" image="/MEMBRES/COLLABORATEURS.png">
        <PresentationCardWhois name="Mikkel ALMONTE--RINGAUD" role="Développeur Web" left />
        <PresentationCardWhois name="Zacharie DUBRULLE" role="Développeur & designer logo" right />
      </PresentationCard>

      <div class="bg-black h-80vh"/>
    </section>
  );
};

export default PresentationCards;
