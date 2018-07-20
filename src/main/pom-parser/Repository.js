class Repository {
  constructor (repository){
    this.id = repository.id;
    this.url = repository.url;
    this.name = repository.name;
    this.layout = repository.layout;
    this.releases = repository.releases;
    this.snapshots = repository.snapshots;

    //return(this);
  }
}

module.exports = { Repository };

/*

                                 *
                                / \
                               /   \
                              /     \
                             /       \
                            /         \



 */