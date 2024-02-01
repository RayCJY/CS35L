import random, sys, argparse

def get_input_data(args):
    if args.echo:
        return args.echo
    elif args.range:
        lo, hi = map(int, args.range.split('-'))
        if lo > hi:
            raise ValueError("Invalid input range: {}".format(args.range))
        return list(range(lo, hi+1))
    elif args.file == '-' or not args.file:
        return sys.stdin.read().splitlines()
    else:
        with open(args.file, 'r') as f:
            return f.read().splitlines()

def output_data(input_data, count, repeat):
    if repeat:
        for _ in range(count):
            print(random.choice(input_data))
    else:
        for item in random.sample(input_data, min(count, len(input_data))):
            print(item)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Randomize the lines from the input')
    parser.add_argument('-e', '--echo', nargs='*', help='Treat each command-line operand as an input line')
    parser.add_argument('-i', '--range', help='Act as if input came from a file containing the range of unsigned decimal integers lo...hi, one per line')
    parser.add_argument('-n', '--count', type=int, default=sys.maxsize, help='Output at most count lines. By default, all input lines are output')
    parser.add_argument('-r', '--repeat', action='store_true', help='Repeat output values. That is select with replacement. With this option, each output line is randomly chosen from all the inputs. This option is typically combined with --head-count; if --head-count is not given, shuf repeats indefinitely.')
    parser.add_argument('file', nargs='?', default=None, help='Input file name or "-" for stdin')
    
    args = parser.parse_args()

    try:
        input_data = get_input_data(args)
        output_data(input_data, args.count, args.repeat)
    except Exception as e:
        parser.error(str(e))
