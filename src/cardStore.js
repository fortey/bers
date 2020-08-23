const { SimplePunch } = require('./abilities.js');

module.exports = {
    'arb': {
        key: 'arb', name: 'Арбалетчик', cost: 6,
        type: 'gold', health: 8, paws: 1, frame: 0,
        abilities: [new SimplePunch([1, 2, 3])]
    },
    'garrid': {
        key: 'garrid', name: 'Гаррид-Лучник', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 1,
        abilities: [new SimplePunch([2, 3, 4])]
    },
    'hedd': {
        key: 'hedd', name: 'Хедд', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 2,
        abilities: [new SimplePunch([2, 2, 3])]
    },
    'ijor': {
        key: 'ijor', name: 'Ижор', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 3,
        abilities: [new SimplePunch([1, 2, 3])]
    },
    'morok': {
        key: 'morok', name: 'Морок', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 4,
        abilities: [new SimplePunch([2, 2, 3])]
    },
    'gorgon': {
        key: 'gorgon', name: 'Песчаный Горгон', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 5,
        abilities: [new SimplePunch([2, 2, 3])]
    },
    'kshar': {
        key: 'kshar', name: 'Кшар', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 6,
        abilities: [new SimplePunch([1, 2, 2])]
    },
    'mant': {
        key: 'mant', name: 'Мантикора', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 7,
        abilities: [new SimplePunch([2, 2, 3])]
    },
    'ogr': {
        key: 'ogr', name: 'Древний Огр', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 8,
        abilities: [new SimplePunch([3, 4, 5])]
    },
    'ork': {
        key: 'ork', name: 'Орк', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 9,
        abilities: [new SimplePunch([3, 3, 4])]
    },
    'osklizg': {
        key: 'osklizg', name: 'Осклизг', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 10,
        abilities: [new SimplePunch([1, 2, 3])]
    },
    'ost': {
        key: 'ost', name: 'Ост', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 11,
        abilities: [new SimplePunch([1, 2, 2])]
    },
    'otsheln': {
        key: 'otsheln', name: 'Отшельник', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 12,
        abilities: [new SimplePunch([1, 1, 2])]
    },
    'shaman': {
        key: 'shaman', name: 'Шаман-Душегрыз', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 13,
        abilities: [new SimplePunch([1, 1, 2])]
    },
    'shield': {
        key: 'shield', name: 'Щитоносец', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 14,
        abilities: [new SimplePunch([1, 2, 2])]
    },
    'skelos': {
        key: 'skelos', name: 'Скелос', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 15,
        abilities: [new SimplePunch([3, 4, 5])]
    },
    'troll': {
        key: 'troll', name: 'Тролль', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 16,
        abilities: [new SimplePunch([2, 4, 5])]
    },
    'trollok': {
        key: 'trollok', name: 'Троллок', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 17,
        abilities: [new SimplePunch([1, 2, 3])]
    },
    'vail': {
        key: 'vail', name: 'Вайл', cost: 6,
        type: 'silver', health: 14, paws: 1, frame: 18,
        abilities: [new SimplePunch([1, 1, 4])]
    },
    'voin': {
        key: 'voin', name: 'Воин Храма', cost: 8,
        type: 'silver', health: 13, paws: 2, frame: 19,
        abilities: [new SimplePunch([2, 4, 5])]
    },
    'volk': {
        key: 'volk', name: 'Степной Волколак', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 20,
        abilities: [new SimplePunch([2, 2, 3])]
    },
    'zmee': {
        key: 'zmee', name: 'Змееглав', cost: 6,
        type: 'gold', health: 8, paws: 2, frame: 21,
        abilities: [new SimplePunch([2, 4, 5])]
    },
};
