import { useState } from "react";
import { Header } from "../../components/Header";
import background from "../../assets/background.png";
import ItemList from "../../components/ItemList";
import "./styles.css";

function App() {
  const [user, setUser] = useState(""); // recebe o valor do Input
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState(null);

  const handleGetData = async () => {
    // função assincrona pois depende do tempo de resposta da api, o await espera a linha de código finalizar pra executar a busca
    const userData = await fetch(`https://api.github.com/users/${user}`); // pega os dados do usuário pelo link da api e trás outros dados além do da api
    const newUser = await userData.json(); // garantir que só vai retornar os dados do usuário e não outros além da api

    if (newUser.name) {
      // se o user.name existir
      const { avatar_url, name, bio, login } = newUser; // dados do objeto da api
      setCurrentUser({ avatar_url, name, bio, login }); // manda para o currentUser

      const reposData = await fetch(
        `https://api.github.com/users/${user}/repos`
      );
      const newRepos = await reposData.json();

      if (newRepos.length) {
        // como é um array usamos length
        setRepos(newRepos); // passando valor do array para repos
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="background app"></img>
        <div className="info">
          <div>
            <input
              name="usuario"
              placeholder="@username"
              value={user}
              onChange={(event) => setUser(event.target.value)}
            />
            <button onClick={handleGetData}>Buscar</button>
          </div>
          {currentUser?.name ? ( // perguntar pro gpt
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  className="profile"
                  alt="imagem de perfil"
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{currentUser.login}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}
          {repos?.length ? (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {repos.map((repo) => (
                <ItemList title={repo.name} description={repo.description} url={repo.html_url} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
