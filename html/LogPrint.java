import java.util.*;
import java.io.*;
import java.text.*;
import java.lang.Runtime;
import java.time.*;
import java.util.regex.*;
class LogPrint
{
    static int counter = 0;
    public static void main(String[] args) throws Exception
    {
        while(true)
        {
            Thread.sleep(1000);
            checkPrinterQueue("psts");
            checkPrinterQueue("pstsb");
            checkPrinterQueue("pstsc");
        }
    }

    public static void checkPrinterQueue(String _which) throws Exception
    {
        String line = null;
        String output = "";
        //System.out.print("a");
        Process ps = Runtime.getRuntime().exec("lpq -P" + _which);

        ps.waitFor();
        BufferedReader input = new BufferedReader(new
                InputStreamReader(ps.getInputStream()));

        PrintWriter pr = new PrintWriter("public_html/" + _which + ".txt");
 
        //System.out.println(input.readLine());
        while((line = input.readLine()) != null)
        {
            if(!line.equals("no entries"))
            {
               output+= line + "\n";
            }
        }
        output = regexThis(output);
        if(pr != null)
        {
            pr.println(output);
            pr.close();
        }
    }

    // get date value
    public static String foo()
    {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("hh MMM d");
        return ( sdf.format(cal.getTime()) );
    }

    // Read source from pipe
    public static String fromText()
    {
        Scanner sc = new Scanner(System.in);
        String text = "";
        while(sc.hasNext())
        {
            text += sc.nextLine() + "\n";
        }
        return text;
    }

    // Regex expr
    public static String regexThis(String _t)
    {
        String output = "";
        String text = _t;
        System.out.println("Text given is:");
        System.out.println(text);

        Pattern pat = Pattern.compile("(.*) bytes");
        Matcher mat = pat.matcher(text);

        System.out.println("Value found is:");

        while(mat.find())
        {
            output += mat.group() + "\n";
        }
        System.out.println(output);
        return output;
    }
}
