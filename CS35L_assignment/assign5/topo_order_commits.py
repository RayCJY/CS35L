'''
$strace -f -o topo-test.tr pytest
====================================================== test session starts =======================================================
platform linux -- Python 3.12.0, pytest-7.4.3, pluggy-1.3.0
rootdir: /w/home.01/ee/ugrad/chengjui/cs35L/assign5/topo-ordered-commits-test-suite
plugins: timeout-1.3.1
collected 24 items                                                                                                               

tests/test_example_repos.py ........................                                                                       [100%]

====================================================== 24 passed in 12.30s =======================================================

(venv)$strace -f python3 topo_order_commits.py [args...] 2>&1 | grep exec
execve("/w/home.01/ee/ugrad/chengjui/cs35L/assign5/topo-ordered-commits-test-su\
ite/venv/bin/python3", ["python3", "topo_order_commits.py", "[args...]"], 0x7ff\
f2a4062d8 /* 50 vars */) = 0
'''

'''
Don’t use python’s subprocess. As the output is nothing and didn't show any error after timeout
'''

import os, sys, zlib

class CommitNode:
    def __init__(self, commit_hash, branches = []):
        self.commit_hash = commit_hash
        self.branches = branches
        self.parents = set()
        self.children = set()
        

'''
1.
Looking the dirctory if it contains .git and discovery process only go up.
Exit with 1 if .git was not found in dirctory.
'''

def find_git_dir():
    curr = os.getcwd()
    #check if .git in directory
    while curr != '/' and '.git'not in os.listdir():
        os.chdir('../')
    if ('.git' not in os.listdir()):
        sys.stderr.write('Not inside a Git repository\n\n')
        exit(1)
    
    #check if it is git directory
    is_git_dir = os.path.join(curr, '.git')
    if not os.path.isdir(is_git_dir):
        sys.stderr.write('Not inside a Git repository\n')
        exit(1)
    os.chdir(is_git_dir)

'''
2.
Initializes an empty dictionary called branchMap
Changes the current working directory to ./refs/heads, which is typically where Git stores its branch references.
Changes the current working directory back to the parent directory ../../ and returns the branchMap dictionary.
'''

def get_branch_map():
    branch_map = {}
    os.chdir('./refs/heads')
    for root, dirs, files in os.walk('.'):
        for f in files + dirs:
            if os.path.isfile(os.path.join(root, f)):
                branch = os.path.join(root, f)[2:]
                fopen = open(branch, 'r')
                hash = fopen.read()[:-1]
                # add it to the dictionary if not already exist
                if hash not in branch_map.keys():
                    branch_map[hash] = [branch]
                else:
                    branch_map[hash].append(branch)
                fopen.close()
    os.chdir('../../')
    return branch_map

'''
3.
Retrieve the parent commit(s) of a given Git commit hash in a Git repository
'''

def get_parents(commit_hash):
    hash_p, hash_s = commit_hash[0:2], commit_hash[2:]
    os.chdir(os.path.join('.', hash_p))
    fopen = open(hash_s, 'rb')

    #decompress
    decomp = zlib.decompress(fopen.read()).decode()
    fopen.close()
    os.chdir('../')

    parents = []
    for line in decomp.split('\n'):
        if line.startswith('parent'):
            parents.append(line.split(' ')[1])
    return parents



'''
4.
Create a graph
Return a list of root commits hashes and the graph
'''

def create_graph(branch_map):
    os.chdir('./objects')
    root_commits = set()
    graph = {}

    # Iterate over the branchMap
    for commit_hash in branch_map:
        if commit_hash in graph.keys():

            graph[commit_hash].branches = branch_map[commit_hash]
        else:
            graph[commit_hash] = CommitNode(commit_hash, branch_map[commit_hash])
            stack = [graph[commit_hash]]

            while len(stack) != 0:
                node = stack.pop()
                parent_hashes = get_parents(node.commit_hash)

                if len(parent_hashes) == 0:
                    root_commits.add(node.commit_hash)

                for parent in parent_hashes:
                    if parent not in graph.keys():
                        graph[parent] = CommitNode(parent)
                    node.parents.add(graph[parent])
                    graph[parent].children.add(node)
                    stack.append(graph[parent])
    os.chdir('../')
    # Return a list of root commits hashes and the graph
    return list(root_commits), graph


def topo_sort(root_commits, graph):
    v = set()
    r = []
    stack = root_commits.copy()

    while len(stack) != 0:
        top = stack[-1]
        v.add(top)
        children = [c for c in graph[top].children if c.commit_hash not in v]
        if len(children) == 0:
            stack.pop()
            r.append(top)
        else:
            stack.append(children[0].commit_hash)
    return r


def output(topo_list, graph):

    for i in range(len(topo_list)):
        c_node = graph[topo_list[i]]
        
        if (len(c_node.branches) == 0):
            print(topo_list[i])

        else:
            print(topo_list[i] + ' ', end = '')
            print(*sorted(c_node.branches))

        if (i < len(topo_list) - 1):
            n_node = graph[topo_list[i + 1]]
            if topo_list[i + 1] not in [parent.commit_hash for parent in c_node.parents]:
                print(*[parent.commit_hash for parent in c_node.parents], end = '=\n\n=')
                print(*[children.commit_hash for children in n_node.children])


'''main function'''
def topo_order_commits():
    find_git_dir()
    branch_map = get_branch_map()
    root_commits, graph = create_graph(branch_map)
    topo_list = topo_sort(root_commits, graph)
    output(topo_list, graph)

if __name__ == '__main__':
    topo_order_commits()
