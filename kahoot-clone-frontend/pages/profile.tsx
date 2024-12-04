import Questions from "@components/Questions";
import Header from "@components/Header";
import styles from "@styles/profile.module.css";
import React, { useEffect, useState } from "react";
import useUser from "@lib/useSSRUser";
import type { db } from "../kahoot";
import { postData } from "@lib/postData";
import {
  APIRequest as GetGameReq,
  APIResponse as GetGameRes,
} from "./api/getGames";
import { TiDelete, TiEdit } from "react-icons/ti";
import { useRouter } from "next/router";
import { APIRequest, APIResponse } from "./api/deleteOneGame";
import { BsTrash } from "react-icons/bs";

function Profile() {
  const { loggedIn, user } = useUser();
  const [data, setData] = useState<null | db.KahootGame[]>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortByMonth, setSortByMonth] = useState(false); // Estado para ordenar por mês

  function getSetUserData() {
    postData<GetGameReq, GetGameRes>("/api/getGames", {
      type: "userId",
      userId: user._id,
    }).then((res) => {
      if (res.error === true) {
        //Todo: error gui
      } else {
        setData(res.games);
        console.log(res.games);
      }
    });
  }

  useEffect(() => {
    if (loggedIn) {
      getSetUserData();
    }
  }, [loggedIn]);

  const router = useRouter();
  if (!loggedIn) return <></>;

  // Função para ordenar por data ou por mês
  const sortedData = data
    ? [...data].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (sortByMonth) {
          // Ordenação por mês (comparar ano e mês)
          const monthA = new Date(a.date).getMonth();
          const monthB = new Date(b.date).getMonth();
          return sortOrder === "asc" ? monthA - monthB : monthB - monthA;
        } else {
          // Ordenação por data
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }
      })
    : [];

  // Função para formatar o mês de forma legível
  const formatMonth = (date: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[new Date(date).getMonth()];
  };

  // Agrupar os jogos por mês
  const groupedByMonth = data?.reduce((groups, game) => {
    const date = new Date(game.date);
    const monthKey = `${formatMonth(game.date)} ${date.getFullYear()}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(game);
    return groups;
  }, {} as Record<string, db.KahootGame[]>);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.otherContainer}`}>
        <Header></Header>
      </div>
      <div className={`${styles.innerContainer}`}>
        <div className={`${styles.innerInnerContainer}`}>
          <div className={`${styles.flexContainer}`}>
            <p className={`${styles.headerMessage}`}>Meus Kahoots:</p>
            {data !== null && data.length !== 0 && (
              <>
                <button
                  className={`${styles.playButton}`}
                  onClick={() => router.push("/create")}
                >
                  Criar Kahoot
                </button>
                <button
                  className={`${styles.sortButton}`}
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  Ordenar por data ({sortOrder === "asc" ? "Crescente" : "Decrescente"})
                </button>
                <button
                  className={`${styles.sortButton}`}
                  onClick={() => setSortByMonth(!sortByMonth)}
                >
                  Ordenar por mês ({sortByMonth ? "Ano" : "Mês"})
                </button>
              </>
            )}
          </div>

          {data !== null && data.length === 0 && (
            <div className={`${styles.emptyMessage}`}>
              <p>Parece que você não tem Kahoots :(</p>
              <button
                className={`${styles.playButton}`}
                onClick={() => router.push("/create")}
              >
                Crie um
              </button>
            </div>
          )}

          <div className={`${styles.kahootGrid}`}>
            {groupedByMonth &&
              Object.keys(groupedByMonth).map((monthKey) => (
                <div key={monthKey}>
                  <h2>{monthKey}</h2> {/* Exibe o mês e ano */}
                  <div className={`${styles.gameGrid}`}>
                    {groupedByMonth[monthKey].map((game) => {
                      const date = new Date(game.date);

                      return (
                        <div className={`${styles.gameElement}`} key={game._id}>
                          <p>
                            <b>{game.title}</b>
                          </p>
                          <p>
                            {game.questions.length}{" "}
                            {game.questions.length === 1 ? "Pergunta" : "Perguntas"}
                          </p>
                          <p>{`Criado: ${date.toLocaleDateString()}`}</p>
                          <button
                            className={`${styles.playButton}`}
                            onClick={() => {
                              router.push({
                                pathname: "/host",
                                query: { gameId: game._id },
                              });
                            }}
                          >
                            Começar
                          </button>
                          <div
                            className={`${styles.edit}`}
                            onClick={() => {
                              router.push({
                                pathname: "/create",
                                query: { editingId: game._id },
                              });
                            }}
                          >
                            <TiEdit></TiEdit>
                          </div>
                          <div
                            className={`${styles.delete}`}
                            onClick={() => {
                              postData<APIRequest, APIResponse>(
                                "/api/deleteOneGame",
                                { gameId: game._id }
                              ).then((res) => {
                                if (res.error === false) {
                                  getSetUserData();
                                }
                              });
                            }}
                          >
                            <BsTrash />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
