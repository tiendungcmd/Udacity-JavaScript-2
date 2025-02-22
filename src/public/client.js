let store = Immutable.Map({
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})
let selected;
// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(state.get('user').name)}
            <section>
                <h3>
                <p>
                Rover name:
                ${SectionRover(state.get('rovers'), apod)}
                </p>
              </h3>
              ${ShowImage(state.get('apod'))}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}! Click one of the buttons below</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const SectionRover = (rovers, apod) => {
    let result = `<ul style="display: flex;"> `
    rovers.forEach(element => {
        result += `<li class="rover-card" onclick="SelectedRover('${element}')"><p >${element}</p></li>`
    });
    result += `</ul>`
    return result;
}
const SelectedRover = (apod) => {
    // if (apod || apod == 'opportunity') {
    //     ShowImage(apod);
    // }
    selected = apod;
    getImageOfMarch(apod);
}

// Example of a pure function that renders infomation requested from the backend
const ShowImage = (apods) => {
    if (!apods || apods.get('apod')) {
        return ''
    }
    const apod = apods.get('image').toJS();
    if (!apod) {
        return ''
    }
    let image_url = null;
    if (selected == 'Spirit' || selected == 'Opportunity') image_url = `https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG`;
    if (apod?.latest_photos) {
        const photo = ImageData(apod.latest_photos);
        const img_src = photo[0]?.img_src ?? image_url;
        const status = photo[0]?.status ?? `active`;
        const earth_date = photo[0]?.earth_date ?? new Date();
        const landing_date = photo[0]?.landing_date ?? new Date();
        if (photo.length == 0) {
            return (`
                <img src="${img_src}" height="350px" width="100%" />
                <h3> Earth Date: <p>${earth_date}</p></h3>
                <h3> Status: <p>${status}</p></p></h3>
                <h3> Landing Date: <p>${landing_date}</p></h3>
            `)
        } else {
            // check if the photo of the day is actually type video!
            if (apod.media_type === "video") {
                return (`
                <p>See today's featured video <a href="${apod.url}">here</a></p>
                <p>${apod.title}</p>
                <p>${apod.explanation}</p>
            `)
            } else {
                return photo.map(p => {
                    return (`
                        <img src="${p.img_src ?? image_url}" height="350px" width="100%" />
                        <h3> Earth Date: <p>${p.earth_date}</p></h3>
                        <h3> Status: <p>${p.status}</p></p></h3>
                        <h3> Landing Date: <p>${p.landing_date}</p></h3>
                        `)
                })
            }
        }
    }
    return '';
}

// 
const ImageData = (images) => {
    const imageInfo = images?.map((item) => ({
        img_src: item.img_src,
        earth_date: item.earth_date,
        landing_date: item.rover.landing_date,
        status: item.rover.status
    }))
        .filter((item) => item.status == 'active')
    return imageInfo;
}


const getImageOfMarch = async (state) => {
    let { apod } = state

    await fetch(`http://localhost:3000/state/${state}`)
        .then(res => res.json())
        .then(async apod => await updateStore(store, { apod }))

    // return data
}
