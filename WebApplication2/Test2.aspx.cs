using Entity;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI.WebControls;

namespace WebApplication2
{
    [System.Web.Script.Services.ScriptService]
    public partial class Test2 : System.Web.UI.Page
    {
        private static readonly ConcurrentDictionary<int, string> m_Dict = new ConcurrentDictionary<int, string>();

        protected string isShowGrid = "1";

        protected void Page_Load(object sender, EventArgs e)
        {
            string name = string.Empty;
            for (int i = 0; i < 163; i++)
            {
                if (i % 2 == 0)
                    name = RandomNameGenerator.NameGenerator.Generate(RandomNameGenerator.Gender.Male);
                else
                    name = RandomNameGenerator.NameGenerator.Generate(RandomNameGenerator.Gender.Female);

                m_Dict.TryAdd(i, name);
            }
        }

        [System.Web.Services.WebMethod()]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public static string GetPersonData()
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;

            context.Response.ContentType = "application/json";
            //--------------------------------------------------------
            // These parameters are sent by the plugin
            var iDisplayLength = (context.Request["iDisplayLength"] != null) ? int.Parse(context.Request["iDisplayLength"]) : 0;
            var iDisplayStart = (context.Request["iDisplayStart"] != null) ? int.Parse(context.Request["iDisplayStart"]) : 0;
            var iSortCol = (context.Request["iSortCol_0"] != null) ? int.Parse(context.Request["iSortCol_0"]) : 0;
            var iSortDir = context.Request["sSortDir_0"];
            var rawSearch = context.Request.Params["sSearch"];
            var echo = (context.Request["sEcho"] != null) ? int.Parse(context.Request["sEcho"]) : 0;
            //---------------------------------------------------------

            //Fetch the data from a repository
            var persons = GetPersons(rawSearch);

            //order function based on the iSortCol parameter
            Func<Person, object> order = p =>
            {
                if (iSortCol == 0)
                {
                    return p.Id;
                }
                return p.Name;
            };

            //order direction based on the iSortDir parameter
            if ("desc" == iSortDir)
            {
                persons = persons.OrderByDescending(order).ToList<Person>();
            }
            else
            {
                persons = persons.OrderBy(order).ToList();
            }

            IEnumerable<Person> li = persons.Select(p => new Person() { Id = p.Id, Name = p.Name }).Skip(iDisplayStart).Take(iDisplayLength);

            List<List<string>> aaList = new List<List<string>>();
            foreach (Person p in li)
            {
                List<string> l = new List<string>();
                l.Add(p.Id.ToString());
                l.Add(p.Name);
                aaList.Add(l);
            }
            //--------------------------------------------------------
            // make an anonymous object for JSON serialization
            var formatedList = new
            {
                sEcho = echo,
                iTotalRecords = persons.Count(),
                iTotalDisplayRecords = persons.Count(),
                aaData = aaList
            };

            var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            var json = serializer.Serialize(formatedList);

            return json;
        }

        private static List<Person> GetPersons(string rawSearch)
        {
            List<Person> people = new List<Person>();
            foreach (KeyValuePair<int, string> keyValuePair in m_Dict)
            {
                people.Add(new Person(keyValuePair.Key, keyValuePair.Value));
            }
            return string.IsNullOrWhiteSpace(rawSearch) ? people : people.Where(m => m.Name.Contains(rawSearch)).ToList();
        }

        [WebMethod]
        public static string DeletePerson(string id)
        {
            string returnValue = "Delete person successfully!";
            if (int.TryParse(id, out int intId))
            {
                m_Dict.TryRemove(intId, out returnValue);
            }
            return returnValue;
        }

        [WebMethod]
        public static string AddPerson(string id, string name)
        {
            string returnValue = "Add person successfully!";

            if (int.TryParse(id, out int intId))
            {
                if (intId == 0) intId = 1 + GetMaxId(m_Dict);
                bool exists = FindByName(name.Trim());
                if (!exists)
                    m_Dict.TryAdd(intId, name.Trim());
                else
                    returnValue = $"Add person failed. Duplicate name '{name.Trim()}'.";
            }
            return returnValue;
        }

        [WebMethod]
        public static string UpdatePerson(Person person)
        {
            string returnValue = "Update person successfully!";

            int id = person.Id;

            string name = person.Name.Trim();

            if (m_Dict.TryGetValue(id, out string oldName))
            {
                Person p = GetByName(name);
                if (p.Id == 0 || (id == p.Id))
                    m_Dict.TryUpdate(id, name, oldName);
                else
                    returnValue = $"Update person failed. Duplicate name with person: {p.ToString()}";
            }
            return returnValue;
        }

        private static bool FindByName(string name)
        {
            var fod = m_Dict.FirstOrDefault(m => m.Value == name);
            return !(fod.Equals(default(KeyValuePair<int, string>)));
        }

        private static Person GetByName(string name)
        {
            var fod = m_Dict.FirstOrDefault(m => m.Value == name);
            return (fod.Equals(default(KeyValuePair<int, string>)) ? new Person() : new Person(fod.Key, fod.Value));
        }

        private static Person GetById(int id)
        {
            var fod = m_Dict.FirstOrDefault(m => m.Key == id);
            return (fod.Equals(default(KeyValuePair<int, string>)) ? new Person() : new Person(fod.Key, fod.Value));
        }

        private static int GetMaxId(ConcurrentDictionary<int, string> m_Dict)
        {
            return m_Dict.Keys.Max();
        }
    }
}