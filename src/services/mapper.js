const convertApiData = (covidInfoByCountries, allCountries) => {
    let countries = [];

    covidInfoByCountries.map((covidInfo) => {
        allCountries.map((country) => {
            if (covidInfo.country === country.country) {
                if (countries.some((checked) => checked.name === country.country)) {
                    countries = countries.map((changed) => {
                        if (changed.name === country.country) {
                            for (let key in changed.timeline.cases) {
                                changed.timeline.cases[key] += covidInfo.timeline.cases[key];
                                changed.timeline.deaths[key] += covidInfo.timeline.deaths[key];
                                changed.timeline.recovered[key] += covidInfo.timeline.recovered[key];
                            }
                            return changed;
                        }
                        return changed;
                    });
                } else {
                    countries.push({
                        timeline: covidInfo.timeline,
                        name: country.country,
                        latitude: country.countryInfo.lat,
                        longitude: country.countryInfo.long,
                    });
                }
            }
        })
    });

    return countries;
};

export default convertApiData;