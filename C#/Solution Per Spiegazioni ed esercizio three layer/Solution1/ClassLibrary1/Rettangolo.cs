namespace Esercizi
{
    public class Rettangolo(int width, int height)
    {
        public int Width { get; set; } = width;
        public int Height { get; set; } = height;
        public int Area => Width * Height;

        public bool ControlloDati()
        {
            if (Width == 0 || Height == 0)
            {
                return false;
            }
            return true;
        }
    }
}
