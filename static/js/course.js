


class Number {

    throw(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}

class Color {
    throw() {
        return `rgb(${new Number().throw(0, 256)},${new Number().throw(0, 256)},${new Number().throw(0, 256)})`
    }
}

class ArrayNumbers {

    build(size) {
        const array = []
        for (let i = 0; i < size; i++) {
            array.push(0)
        }
        return array
    }
}

class Pet {
    constructor(tagType, className, idName, src, alt) {
        if (this.tagType != "") {
            this.tagType = tagType
        }
        
        this.className = className
        this.idName = idName
        this.src = src
        this.alt = alt
        if (this.tagType != "") {
            this.pet = document.createElement(this.tagType)
        }
    }

    shuffle(petElements) {
        for (let i = 0; i < petElements.length; i++) {
            let randomIndex = new Number().throw(0, petElements.length - 1)
            let current = petElements[i]
            petElements[i] = petElements[randomIndex]
            petElements[randomIndex] = current
        }
    }

    setAttribs() {
        this.pet.setAttribute("class", this.className)
        this.pet.setAttribute("id", this.idName)
        this.pet.setAttribute("src", this.src)
        this.pet.setAttribute("alt", this.alt)
    }

    setPosition(petElements, petProperties) {
        this.shuffle(petProperties)
        petElements.forEach((pet, pos) => {
            pet.setAttribute("id", petProperties[pos].id)
            pet.setAttribute("src", petProperties[pos].src)
            pet.setAttribute("alt", petProperties[pos].alt)
        })
    }

    setCss(petElements, petName) {
        petElements.forEach(pet => {
            pet.className = petName
            pet.style.margin = ".4rem"
            
            // pet.addEventListener("load", () => {

            //     if (pet.naturalHeight >= 40) {
            //         pet.style.height = `${pet.naturalHeight - 10}px`
            //         pet.style.width = `${pet.naturalWidth - 10}px`
            //     }

            //     if (pet.naturalHeight >= 50) {
            //         pet.style.height = `${pet.naturalHeight - 15}px`
            //         pet.style.width = `${pet.naturalWidth - 15}px`
            //     }
            // })
            
        })
    }

    setPetExitByClick(petElements) {
        petElements.forEach(pet => {
            pet.addEventListener("click", () => {
                if (pet.style.display == "") {
                    pet.style.display = "none"
                } 
            })
        })
    }

    setWarmUp(petElements, petsOffset, runElement) {
        let loopBeforeMatch = setInterval(() => {
            petElements.forEach((pet, pos) => {
                pet.style.transform = `translateX(${petsOffset[pos]}px) rotate(${new Number().throw(-5, 6)}deg)`
            })
            if (runElement.className == "y") {
                clearInterval(loopBeforeMatch)
            }
        }, 500)
    }

    moveEachPet(currentOffset, petIndex, petElements, petsOffset, min, max) {
        petsOffset[petIndex] += new Number().throw(min, max)
        petElements[petIndex].style.transform = `translateX(${currentOffset}px) rotate(${new Number().throw(-11, 11)}deg)`
        scores.array[petIndex].textContent = `${petsOffset[petIndex]}px`
        scores.array[petIndex].style.transform = `translateX(${currentOffset - 5}px)`
        let value = new Number().throw(1, 100)
        
        if (value % 10 == 0 && value % 20 == 0) {
            scores.array[petIndex].style.color = `${new Color().throw()}`
        } else {
            scores.array[petIndex].style.color = `inherit`
        }
    }
}

class Query {
    constructor(name) {
        if (name != "") {
            this.array = document.querySelector(name)
        }
    }

    appendMultiple(containerElement, wrapperElement, nestedElement, className, amount) {
        for (let i = 0; i < amount; i++) {
            // Div shelters img and both are placed within the existing div that will shelter them all
            const imgWrapperTag = document.createElement(wrapperElement)
            const p = document.createElement("p")
            p.className = "score"
            p.style.display = "inline-block"
            p.textContent = "0"
            const imgTag = new Pet(nestedElement, className, "", "", "")
            imgTag.setAttribs()
            imgWrapperTag.appendChild(p)
            imgWrapperTag.appendChild(imgTag.pet)
            containerElement.appendChild(imgWrapperTag) 
        }
    }
}

class Queries {
    constructor(name) {
        if (name != "") {
            this.array = document.querySelectorAll(name)
        }
    }
}

class Course {
    constructor(xThreshold, petElements, petsOffset, petToolKit, winnerElement, triggerElement, minSpd, maxSpd) {
        this.xThreshold = xThreshold
        this.petElements = petElements
        this.petsOffset = petsOffset
        this.petToolKit = petToolKit
        this.winnerElement = winnerElement
        this.triggerElement = triggerElement
        this.minSpd = minSpd
        this.maxSpd = maxSpd

        this.trigger()
        if (this.triggerElement.className === "y") {
            this.start()
        }
    }

    trigger() {
        this.triggerElement.addEventListener("click", () => {
            if (this.triggerElement.className === "n") {
                this.triggerElement.className = "y"
                this.triggerElement.textContent = "resetar"
                this.start()
            } 
            else if (this.triggerElement.className === "y") {
                this.triggerElement.className = "n"
                // Restart with hard reset
                location.reload()
            }
        })
    }

    // Stops the match when leading pet "x" position is bigger than the breaking point 
    isFinished(petX) {
        return petX > this.xThreshold
    }

    isPetQualified(petIndex) {
        return this.petElements[petIndex].style.display != "none"
    }

    trackFirstPlace(passHighestOffsetValue=false) {
        /*
        petsOffsets        = array of numbers
        petsElements       = array of HTML elements
        petsOffsets.length = petsElements.length (because each offset references one pet)
        
        highestValue
            gets highest value from the array of numbers (which increases constantly) ("match" function does it)

        highestValueIndex
            gets the correct index of the offset that is the greatest one
            this means, this index is the correct reference pointing to the HTML element as well
            if, for instance, this value is 2, then the HTML on position 2 is the current leading pet on the course
            
        firstPlace
            get the correct HTML element of the animal and gets its id attribute value
            this way, you have the name of the current winner of the course

        passHighestOffsetValue
            works as an adapting tool for the "switchDayTime" function
            "switchDayTime" changes the game scenario based on the value of the offset of the leading pet
            so if the leading pet reaches a certain value (passed by this variable), the scenario changes its background
        */
 
        let highestValue = this.petsOffset.reduce((left, right) => (right > left ? right : left), this.petsOffset[0])
        let highestValueIndex = this.petsOffset.indexOf(highestValue)
        let firstPlace = this.petElements[highestValueIndex].attributes.id.textContent
        
        if (passHighestOffsetValue) {
            return highestValue
        }

        return firstPlace
    }

    highlightFirstPlace(petIndex) {
        this.petElements[petIndex].style.borderBottom = `solid .3rem ${new Color().throw()}`
        this.petElements[petIndex].style.padding = `.2rem`
        // document.body.style.padding = `.2rem`
    }

    cancelHighlight(petIndex) {
        this.petElements[petIndex].style.borderBottom = "inherit"
        this.petElements[petIndex].style.padding = "inherit"
    }

    identifyLeadingPet(firstPlaceName) {
        this.petElements.forEach((pet, pos) => {
            if (firstPlaceName === pet.attributes.id.textContent) {
                this.highlightFirstPlace(pos)
            }
            else {
                this.cancelHighlight(pos)
            }
        })
    }

    switchDayTime(petX) {
        const fixedPath = 'url("../static/img/horizons/'
        const fixedTransition = 'background-image ease-in-out 1.7s'

        if (petX >= 150 && petX < 500) {
            document.body.style.transition = fixedTransition
            document.body.style.backgroundImage = `${fixedPath}morning.jpg")`
        }

        if (petX >= 500 && petX < 800) {
            document.body.style.transition = fixedTransition
            document.body.style.backgroundImage = `${fixedPath}afternoon.jpg")`
        }

        if (petX >= 800 && petX < 950) {
            document.body.style.transition = fixedTransition
            document.body.style.backgroundImage = `${fixedPath}dusk.jpg")`
        }

        if (petX >= 950) {
            document.body.style.transition = fixedTransition
            document.body.style.backgroundImage = `${fixedPath}night.jpg")`
        }     
    }

    reset(firstPlaceName, courseLoop) {
        this.winnerElement.textContent = firstPlaceName
        this.triggerElement.textContent = "Reiniciar"
        clearInterval(courseLoop)
    }

    start() {
        let firstPlace
        let courseLoop = setInterval(() => {
            
            this.petsOffset.forEach((petX, petIndex) => {

                if (this.isFinished(petX)) {
                    this.reset(firstPlace, courseLoop)
                }

                // How pets run (if they were not clicked on their picture)
                if (this.isPetQualified(petIndex)) {
                    this.petToolKit.moveEachPet(petX, petIndex, this.petElements, this.petsOffset, this.minSpd, this.maxSpd)
                }

                firstPlace = this.trackFirstPlace()
                let firstPlacePos = this.trackFirstPlace(true)

                this.identifyLeadingPet(firstPlace)
                this.switchDayTime(firstPlacePos)

            })

        }, 100)
    }
}

// this file is being called at "templates", so it needs to come back 1 level and access "static"
const path = "../static/img/runners/"

const petsProperties = [
    {id: "beet_baby_bear", src: `${path}ailu_the_bear.gif`, alt: ""},
    {id: "baby_brown_wolf", src: `${path}allu_the_brown_wolf.gif`, alt: ""},
    {id: "orange_dog", src: `${path}babe_the_welsh_corgi.gif`, alt: ""},
    {id: "dog_with_necklace", src: `${path}brandy.gif`, alt: ""},
    {id: "siamese_cat", src: `${path}cookie_boots.gif`, alt: ""},
    {id: "baby_panda_bear", src: `${path}dumpling_the_bear.gif`, alt: ""},
    {id: "turkey", src: `${path}dumplin_McGibblet.gif`, alt: ""},
    {id: "baby_mystic_fox", src: `${path}ember_the_spirited_fox.gif`, alt: ""},
    {id: "tiny_colibri", src: `${path}gift_of_the_colibri.gif`, alt: ""},
    {id: "guinea_pig", src: `${path}grinny.gif`, alt: ""},
    {id: "toast_baby_bear", src: `${path}grumpy_the_bear.gif`, alt: ""},
    {id: "cardinal", src: `${path}holiday_cardinal.gif`, alt: ""},
    {id: "dark_baby_bear", src: `${path}kuroko_the_bear.gif`, alt: ""},
    {id: "mystic_owl", src: `${path}lira_the_moga.gif`, alt: ""},
    {id: "baby_gray_wolf", src: `${path}lobo_the_gray_wolf.gif`, alt: ""},
    {id: "mystic_cat", src: `${path}mewpit.gif`, alt: ""},
    {id: "mystic_sheep", src: `${path}mimple_the_moga.gif`, alt: ""},
    {id: "monkey", src: `${path}nihonzaru.gif`, alt: ""},
    {id: "baby_black_wolf", src: `${path}nochi_the_black_wolf.gif`, alt: ""},
    {id: "otter", src: `${path}olly_the_otter.gif`, alt: ""},
    {id: "coffee_baby_bear", src: `${path}pudding_the_bear.gif`, alt: ""},
    {id: "sheep", src: `${path}ramune.gif`, alt: ""},
    {id: "toucan", src: `${path}sherbet.gif`, alt: ""},
    {id: "wombat", src: `${path}sisky_the_wombat.gif`, alt: ""},
    {id: "baby_dark_fox", src: `${path}sly_the_black_fox.gif`, alt: ""},
    {id: "nightingale", src: `${path}song_of_the_nightingale.gif`, alt: ""},
    {id: "halloween_cat", src: `${path}spice_the_pumpkitten.gif`, alt: ""},
    {id: "baby_seal", src: `${path}sweet_sealie.gif`, alt: ""},
    {id: "young_coyote", src: `${path}the_coyote_brothers.gif`, alt: ""},
    {id: "purple_cat", src: `${path}the_puffpaw_family_purple.gif`, alt: ""},
    {id: "white_cat", src: `${path}the_puffpaw_family_white.gif`, alt: ""},
    {id: "gray_cat", src: `${path}the_purrpaw_family_gray.gif`, alt: ""},
    {id: "corn_baby_bear", src: `${path}tummy2_the_bear.gif`, alt: ""},
    {id: "candy_baby_bear", src: `${path}tunnu_the_bear.gif`, alt: ""},
    {id: "space_goat", src: `${path}twinkle_the_space_goat.gif`, alt: ""},
    {id: "sad_cat", src: `${path}waffles_the_cat.gif`, alt: ""},
]

const courseLimit = 1200
const runnersMinSpeed = 1
const runnersMaxSpeed = 11

const run = document.getElementById("btn-start") 
const winner = document.getElementById("winner")
const petToolKit = new Pet("", "", "", "", "")
const petsTemp = new Query(".pets")
petsTemp.appendMultiple(petsTemp.array, "div", "img", "pet", 7)
const pets = new Queries(".pet")
const scores = new Queries(".score")
const petsOffset = new ArrayNumbers().build(pets.array.length)

petToolKit.setPosition(pets.array, petsProperties)
petToolKit.setCss(pets.array, "")
petToolKit.setPetExitByClick(pets.array)
petToolKit.setWarmUp(pets.array, petsOffset, run)

const course = new Course(courseLimit, pets.array, petsOffset, petToolKit, winner, run, runnersMinSpeed, runnersMaxSpeed)
