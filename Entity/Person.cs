namespace Entity
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public Person()
        {
        }

        public Person(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}