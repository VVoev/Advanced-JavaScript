function solve() {
    var module = (function () {

        var player,
            playable,
            playlist,
            audio,
            video,
            validator,
            CONSTANTS = {
                TEXT_MIN_LEN: 3,
                TEXT_MAX_LEN: 25
            };

        validator = {
            validateIfUndefined: function (val, name) {
                name == name || 'Value';
                if (val === undefined) {
                    throw new Error(`${name} cannot be undefined`)
                }
            },

            validatePageandSize: function (page, size, maxElements) {
                this.validateIfUndefined(page);
                this.validateIfUndefined(size);
                if (typeof page !== 'number' || typeof size !== 'number')
                    throw new Error(`It is not a number`);

                if (page < 0 || size < 0) {
                    throw new Error(`Page or size is less than 0`);
                }

                if (page * size > maxElements) {
                    throw new Error('Parge * size should be less than maxElements')
                }
            },

            validateIfObject: function (val, name) {
                name = name || 'Value';
                if (typeof val !== 'object') {
                    throw new Error(name + 'must be a object');
                }
            },
            validateString: function (val, name) {

                name == name || 'Value';
                this.validateIfUndefined(val, name);

                if (typeof val !== 'string') {
                    throw new Error(`${name} must be a string`)
                }

                if (val.length < CONSTANTS.TEXT_MIN_LEN || val.length > CONSTANTS.TEXT_MAX_LEN) {
                    throw new Error(`${name} must be between ${CONSTANTS.TEXT_MIN_LEN} and ${CONSTANTS.TEXT_MAX_LEN}`)
                }
            },

            validateImdbRating: function (val) {
                this.validateIfUndefined(val, 'IMDB Rating');
                if (val < 1 || val > 5) {
                    throw new Error('IMDB must be between 1 and 5')
                }
            },

            validatePositiveNumber: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);

                if (typeof val !== 'number') {
                    throw new Error(name + 'must be a number');
                }

                if (val <= 0) {
                    throw new Error(name + 'must be a positive')
                }
            },

            validatePlayableId: function (id) {
                this.validateIfUndefined(id, 'Playable id');
                if (typeof id !== 'number') {
                    id = id.id;
                }

                this.validateIfUndefined(id, 'Playable is not valid')
                return id;
            }
        }

        player = (function () {
            var currentPlayerId = 0;
            player = Object.create({});

            Object.defineProperty(player, 'init', {
                value: function (name) {
                    this.name = name;
                    this._id == ++currentPlayerId;
                    this._playlists = [];
                    return this;
                }
            })

            Object.defineProperty(player, 'id', {
                get: function () {
                    return this._id;
                }
            })

            Object.defineProperty(player, 'name', {
                get: function () {
                    return this._name;
                },

                set: function (val) {
                    validator.validateString(val, 'Player name');
                    this._name = val;
                }
            })

            Object.defineProperty(player, 'addPlaylist', {
                value: function (playlist) {
                    validator.validateIfUndefined(playlist, 'playlist is undefined');
                    if (playlist.id === undefined) {
                        throw new Error(`Player and playlist must have a id`);
                    }

                    this._playlists.push(playlist);
                    return this;
                }
            })

            Object.defineProperty(player, 'getPlaylistById', {
                value: function (id) {
                    var isFound = this._playlists.find((p) => {
                        return p.id === id;
                    })
                    isFound = isFound || null;
                    return isFound;
                }
            })

            Object.defineProperty(player, 'listPlaylists', {
                value: function (page, size) {
                    validator.validatePageandSize(page, size, this._playlists.length);

                    return this._playlists.slice()
                        .sort(getSorting('name', 'id'))
                        .splice(page * size, size);
                }
            })

            Object.defineProperty(player, 'contains', {
                value: function (playable, playlist) {
                    var indexPlaylist = this._playlists.indexOf(playlist);
                    if (indexPlaylist < 0) {
                        return false;
                    }
                    var playlist = this._playlists[indexPlaylist];
                    var playable = playlist.getPlayableById(playable.id);

                    if (playable == null || playlist == null) {
                        return false;
                    }

                    return true;
                }
            })

            Object.defineProperty(player, 'search', {
                value: function (pattern) {
                    var result = [];
                    this._playlists.forEach((pl) => {
                        pl._playables.forEach((play) => {
                            if (play.title.includes(pattern)) {
                                var x = {
                                    id: play.id,
                                    name: play.title
                                }
                                result.push(x);
                            }
                        })
                    })

                    return result;
                }
            })

            function getSorting(firstParam, secondParam) {
                return function (first, second) {
                    if (first[firstParam] < second[firstParam]) {
                        return -1;
                    }
                    else if (first[firstParam] > second[firstParam]) {
                        return 1;
                    }

                    if (first[secondParam] < second[secondParam]) {
                        return -1;
                    }
                    else if (first[secondParam] > second[secondParam]) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            }

            Object.defineProperty(player, 'removePlayListById', {
                value: function (id) {
                    if (typeof id === 'object') {
                        var isFound = this._playlists.find((p) => {
                            return p.id === id._id;
                        })
                        isFound = isFound || null;
                        if (isFound) {
                            var index = this._playlists.indexOf(isFound);
                            this._playlists.splice(index, 1);
                            return this._playlists;
                        }
                    }

                    var isFound = this._playlists.find((p) => {
                        return p.id === id;
                    })
                    isFound = isFound || null;
                    if (isFound) {
                        var index = this._playlists.indexOf(isFound);
                        this._playlists.splice(index, 1);
                        return this._playlists;
                    }
                    throw new Error('Such playlist does not exist');
                }
            })

            return player;
        }());

        playlist = (function () {
            var playlist = Object.create({});
            var currentPlayListId = 0;

            Object.defineProperty(playlist, 'init', {
                value: function (name) {
                    this._name = name;
                    this._id = ++currentPlayListId;
                    this._playables = [];
                    return this;
                }
            })

            function sortByTitleThenById(a, b) {
                if (a.title < b.title) {
                    return -1
                } else if (a.title > b.title) {
                    return 1;
                }

                if (a.id < b.id) {
                    return -1
                } else if (a.id > b.id) {
                    return 1;
                }
                else {
                    return 0;
                }
            }

            Object.defineProperty(playlist, 'id', {
                get: function () {
                    return this._id;
                },

                set: function (val) {
                    this._id = val;
                }
            })


            Object.defineProperty(playlist, 'name', {
                get: function () {
                    return this._name;
                },
                set: function (val) {
                    validator.validateString(val, 'Playlist name');
                    this._name = val;
                }
            })

            Object.defineProperty(playlist, 'addPlayable', {
                value: function (playable) {
                    validator.validateIfUndefined(playable, 'Playlist add playable');
                    validator.validateIfObject(playable, 'Playable add parameter');
                    validator.validateIfUndefined(playable.id, 'Playable add plarable must have id');

                    this._playables.push(playable);
                    return this;
                }
            });

            Object.defineProperty(playlist, 'getPlayableById', {
                value: function (id) {
                    validator.validateIfUndefined(id, 'Playable get playable doest have id');

                    var isFound = this._playables.find((p) => {
                        return p.id === id;
                    })

                    if (isFound)
                        return isFound;
                    return null
                }
            })

            Object.defineProperty(playlist, 'removePlayable', {
                value: function (id) {
                    id = validator.validatePlayableId(id);

                    var foundIndex = this._playables.find((p) => {
                        return p._id === id;
                    })
                    if (foundIndex < 0) {
                        throw new Error('not found in')
                    }

                    this._playables.splice(foundIndex, 1);
                    return this;
                }
            })

            Object.defineProperty(playlist, 'listPlaylables', {
                value: function (page, size) {
                    validator.validatePageandSize(page, size, this._playables.length);


                    return this
                        ._playables
                        .slice()
                        .sort(sortByTitleThenById)
                        .splice(page * size, size)
                }
            })

            return playlist;
        }());

        playable = (function () {
            var currentPlayableId = 0;
            var playable = Object.create({});

            Object.defineProperty(playable, 'init', {
                value: function (title, author) {
                    this.title = title;
                    this.author = author;
                    this._id = ++currentPlayableId;
                    return this;
                }
            })

            Object.defineProperty(playable, 'id', {
                get: function () {
                    return this._id;
                }
            })

            Object.defineProperty(playable, 'title', {
                get: function () {
                    return this._title;
                },

                set: function (val) {
                    validator.validateString(val, 'Playable Text');
                    this._title = val;
                }
            })

            Object.defineProperty(playable, 'author', {
                get: function () {
                    return this._author;
                },

                set: function (val) {
                    validator.validateString(val, 'Playable Author');
                    this._author = val;
                }
            })

            Object.defineProperty(playable, 'play', {
                value: function () {
                    return `${this.id}. ${this.title} - ${this.author}`
                }
            })


            return playable;
        }());

        audio = (function (parent) {
            var audio = Object.create(parent);

            Object.defineProperty(audio, 'init', {
                value: function (title, author, length) {
                    parent.init.call(this, title, author);
                    this.length = length;
                    return this;
                }
            });

            Object.defineProperty(audio, 'length', {
                get: function () {
                    return this._length;
                },

                set: function (val) {
                    validator.validatePositiveNumber(val, 'Audio Lenght');
                    this._length = val;
                }
            })

            Object.defineProperty(audio, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.length;
                }
            })

            return audio;
        }(playable));

        video = (function (parent) {
            var video = Object.create(parent);

            Object.defineProperty(video, 'init', {
                value: function (title, author, imdbRating) {
                    parent.init.call(this, title, author);
                    this.imdbRating = imdbRating;
                    return this;
                }
            })

            Object.defineProperty(video, 'imdbRating', {
                get: function () {
                    return this._imdbRating;
                },

                set: function (val) {
                    validator.validateImdbRating(val);
                    this._imdbRating = val;
                }
            })


            Object.defineProperty(video, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.imdbRating;
                }
            })

            return video;
        }(playable));

        return {
            getPlayer: function (name) {
                return Object.create(player).init(name);
            },
            getPlaylist: function (name) {
                return Object.create(playlist).init(name);
            },
            getAudio: function (title, author, length) {
                return Object.create(audio).init(title, author, length);
            },
            getVideo: function (title, author, imdbRating) {
                return Object.create(video).init(title, author, imdbRating);
            }
        }
    }());

    return module;
}

var module = solve();

var player = module.getPlayer('Vlado');

var playlist = module.getPlaylist('My Playlist 1');
var playlist2 = module.getPlaylist('My Playlist 2');
var playlist3 = module.getPlaylist('My Playlist 3');

var audio1 = module.getAudio('First', 'First', 1);
var audio2 = module.getAudio('SecondFirst', 'Second', 2);
var audio3 = module.getAudio('Third', 'Third', 3);
var audio4 = module.getAudio('Fourth', 'Fourth', 4);

playlist.addPlayable(audio3);
playlist.addPlayable(audio2);
playlist.addPlayable(audio1);

player.addPlaylist(playlist).addPlaylist(playlist2).addPlaylist(playlist3);

// for (var i = 1; i <= 15; i++) {
//     var currentAudio = module.getAudio('Audio ' + i, 'Author ' + i, i);
//     playlist.addPlayable(currentAudio);
//     console.log(currentAudio.play());
// }

// for (var i = 1; i <= 15; i++) {
//     var currentVideo = module.getVideo('Video ' + i, 'Video ' + i, 1);
//     playlist.addPlayable(currentVideo);
//     console.log(currentVideo.play());
// }

console.log(player);
var isAudio1onPlayListOne = player.contains(audio1, playlist);
var isAudio4onPlayListOne = player.contains(audio4, playlist);

var patternSearchValid = player.search('First');
var patternSearchInValid = player.search('Baxur');