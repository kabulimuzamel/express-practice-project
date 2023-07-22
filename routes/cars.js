const express = require('express');
const Joi = require('joi');
const carsRouter = express.Router();

const carCompanies = [
  {
    name: 'Toyota',
    country: 'Japan',
    founded: 1937,
    popularModels: ['Corolla', 'Camry', 'RAV4'],
    slogan: 'Let\'s Go Places',
  },
  {
    name: 'Ford',
    country: 'United States',
    founded: 1903,
    popularModels: ['F-150', 'Mustang', 'Explorer'],
    slogan: 'Built Ford Tough',
  },
  {
    name: 'Volkswagen',
    country: 'Germany',
    founded: 1937,
    popularModels: ['Golf', 'Jetta', 'Passat'],
    slogan: 'Das Auto',
  },
  {
    name: 'Honda',
    country: 'Japan',
    founded: 1948,
    popularModels: ['Civic', 'Accord', 'CR-V'],
    slogan: 'The Power of Dreams',
  },
  {
    name: 'Chevrolet',
    country: 'United States',
    founded: 1911,
    popularModels: ['Silverado', 'Equinox', 'Tahoe'],
    slogan: 'Find New Roads',
  },
  {
    name: 'BMW',
    country: 'Germany',
    founded: 1916,
    popularModels: ['3 Series', '5 Series', 'X5'],
    slogan: 'The Ultimate Driving Machine',
  },
  {
    name: 'Nissan',
    country: 'Japan',
    founded: 1933,
    popularModels: ['Altima', 'Sentra', 'Rogue'],
    slogan: 'Innovation That Excites',
  },
  {
    name: 'Mercedes-Benz',
    country: 'Germany',
    founded: 1926,
    popularModels: ['C-Class', 'E-Class', 'GLC'],
    slogan: 'The Best or Nothing',
  },
  {
    name: 'Hyundai',
    country: 'South Korea',
    founded: 1967,
    popularModels: ['Elantra', 'Tucson', 'Santa Fe'],
    slogan: 'New Thinking. New Possibilities.',
  },
  {
    name: 'Tesla',
    country: 'United States',
    founded: 2003,
    popularModels: ['Model S', 'Model 3', 'Model X'],
    slogan: 'Accelerating the World\'s Transition to Sustainable Energy',
  }
];

// GET 

carsRouter.get('/', (req, res) => {
    res.send(carCompanies);
});

carsRouter.get('/:name', (req, res) => {
    // Check for its existence
    const carObj = carCompanies.find(obj => obj.name === req.params.name);
    if(!carObj) {
        return (
            res.status(404).send(`The car with the name ${req.params.name} was not found`)
        )
    }

    // Return the request
    res.send(carObj);
});

// POST 

carsRouter.post('/', (req, res) => {
    // Check for its duplicate 
    const isExist = carCompanies.find(obj => obj.name === req.body.name);
    if(isExist) {
        return (
            res.status(400).send(`Information about ${req.body.name} already exists`)
        )
    }

    // Check for Validation 
    validateRequest(req.body, res);

    // Add the request
    const carObj = {
        name: req.body.name,
        country: req.body.country,
        founded: req.body.founded,
        popularModels: req.body.popularModels,
        slogan: req.body.slogan
    }
    carCompanies.push(carObj);
    res.send(carObj);
});

// PUT 

carsRouter.put('/:name', (req, res) => {
	// Check for its name existence
	const carObj = carCompanies.filter(obj => {
    if(obj.name === req.params.name) {
      return true;
    }
  })

  const isExist = Object.keys(carObj).length;
	if (!isExist) {
		return res
			.status(404)
			.send(`The car with the name ${req.params.name} was not found`)
	};
  // Check for body existence 
  if(!Object.keys(req.body).length) {
    return res.send('You have not tried to update anything yet')
  }

	// Check for body validation Validation
	const reqKeys = Object.keys(req.body);
  const objKeys = Object.keys(carCompanies[0]);
  const notValidKeys = reqKeys.filter(key => {
    if(!objKeys.includes(key)) {
      return true;
    }
  });

    const errMessage = notValidKeys.join(', ');
    if(errMessage) {
        return (
            res.send(`The following keys are not valid: ${errMessage}`)
        )
    };

    // Update the data

    reqKeys.forEach(key => {
        carCompanies[carCompanies.indexOf(carObj[0])][key] = req.body[key]
    });

    res.send(carObj[0]);
})

// DELETE
carsRouter.delete('/:name', (req, res) => {
  // Check for its existence
  const carObj = carCompanies.find(obj => obj.name === req.params.name);
  if(!carObj) {
    return res.status(404).send(`The information for ${req.params.name} was not found`)
  }

  const toRemoveCarObjIndex = carCompanies.indexOf(carObj);
  carCompanies.splice(toRemoveCarObjIndex, 1);
  res.send(carObj);
})

function validateRequest(req, res) {
    const schema = Joi.object({
        name: Joi.required(),
        country: Joi.required(),
        founded: Joi.required(),
        popularModels: Joi.required(),
        slogan: Joi.required(),
    });

    const { error } = schema.validate(req);
    if(error) {
        return (
            res.status(400).send(error.details[0].message)
        )
    }
}

module.exports = carsRouter;